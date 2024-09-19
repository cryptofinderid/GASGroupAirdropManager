var token = "TELEGRAM_BOT_TOKEN"; // Ganti dengan token bot Telegram Anda
var sheetId = "SPREADSHEET_ID";   // Ganti dengan ID spreadsheet Anda
var GROUPID = "GROUP_ID";
var userSheetName = "user_" + GROUPID; // Nama sheet berdasarkan id grup

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var chatId = contents.message ? contents.message.chat.id : contents.callback_query.message.chat.id;
    var text = contents.message ? contents.message.text : "";
    var messageId = contents.message ? contents.message.message_id : contents.callback_query.message.message_id;
    var userId = contents.message ? contents.message.from.id : contents.callback_query.from.id;

    var chatType = contents.message ? contents.message.chat.type : "";

    // Periksa apakah pengguna adalah admin sebelum melanjutkan
    var isAdmin = checkAdminAndPost(GROUPID, userId);
    if (!isAdmin) {
      // Jika bukan admin, kirim pesan dan hentikan eksekusi
      sendMessage(chatId, `Anda bukan admin atau pemilik grup *${getGroupName(GROUPID)}*, tidak bisa mengakses fitur bot.`);
      return; // Hentikan eksekusi lebih lanjut
    }

    var userData = getUserData(chatId);

    if (!userData) {
      userData = { step: "start" };
      saveUserData(chatId, userData);
    }

    if (text == "/cancel") {
      if (isGroup(chatType)) {
        return;
      }
      clearChat(chatId, messageId);
      sendMessage(chatId, "Proses dibatalkan.");
      deleteUserData(callbackChatId);
    } else if (text == "/start") {
      if (isGroup(chatType)) {
        return;
      }
      sendMessage(chatId, "Selamat datang!!!");
      createSheetIfNotExist(userSheetName);
      userData = { step: "start" };
      saveUserData(chatId, userData);
    } else if (text == "/add") {
      if (isGroup(chatType)) {
        return;
      }
      logSheet("Input dimulai", "SUCCESS");
      userData.step = "name_step";
      saveUserData(chatId, userData);
      sendMessage(chatId, "Masukkan Nama:");
    } else if (userData.step == "name_step") {
      logSheet("Memasukkan nama", "SUCCESS");
      userData.name = text;
      userData.step = "type_step";
      saveUserData(chatId, userData);
      sendMessage(chatId, "Masukkan Type:");
    } else if (userData.step == "type_step") {
      logSheet("Memasukkan type", "SUCCESS");
      userData.type = text;
      userData.step = "url_step";
      saveUserData(chatId, userData);
      sendMessage(chatId, "Masukkan URL:");
    } else if (userData.step == "url_step") {
      logSheet("Memasukkan url", "SUCCESS");
      userData.url = text;
      userData.step = "confirm_step";
      saveUserData(chatId, userData);

      var name = userData.name;
      var type = userData.type;
      var url = userData.url;

      var confirmationMessage = `Apakah data berikut sudah benar?\n\nNama: ${name}\nType: ${type}\nUrl: ${url}`;
      var buttons = {
        inline_keyboard: [
          [{ text: "Ya", callback_data: "confirm_yes" }],
          [{ text: "Tidak", callback_data: "confirm_no" }]
        ]
      };
      sendMessage(chatId, confirmationMessage, buttons);
    } else if (text == "/edit") {
      if (isGroup(chatType)) {
        return;
      }
      clearChat(chatId, messageId);
      var buttons = getEditButtons(userSheetName);
      sendMessage(chatId, "Pilih data yang akan diedit:", buttons);
    } else if (text == "/del") {
      if (isGroup(chatType)) {
        return;
      }
      clearChat(chatId, messageId);
      var buttons = getDeleteButtons(userSheetName);
      sendMessage(chatId, "Pilih data yang akan dihapus:", buttons);
    } else if (text == "/daily") {
      if (!isGroup(chatType)) {
        sendMessage(chatId, "Perintah ini hanya bisa dijalankan di grup.");
        return;
      }
      postAirdropList(chatId);
    }

    if (contents.callback_query) {
      var callbackData = contents.callback_query.data;
      var callbackChatId = contents.callback_query.message.chat.id;
      var callbackMessageId = contents.callback_query.message.message_id;

      var userData = getUserData(callbackChatId); // Ambil data pengguna

      if (callbackData.startsWith("edit_")) {
        var rowIndex = parseInt(callbackData.split("_")[1]);
        userData.step = "name_step";
        userData.edit_row = rowIndex;
        saveUserData(callbackChatId, userData);
        clearChat(callbackChatId, callbackMessageId);
        sendMessage(callbackChatId, "Masukkan Nama baru:");
      } else if (callbackData.startsWith("del_")) {
        var rowIndex = parseInt(callbackData.split("_")[1]);
        userData.del_row = rowIndex;
        saveUserData(callbackChatId, userData);
        clearChat(callbackChatId, callbackMessageId);

        var name = getRowData(userSheetName, rowIndex)[0];  // Mengambil nama dari baris yang akan dihapus
        var deleteMessage = `Apakah Anda yakin ingin menghapus data: ${name}?`;
        var buttons = {
          inline_keyboard: [
            [{ text: "Ya", callback_data: "delete_yes" }],
            [{ text: "Tidak", callback_data: "delete_no" }]
          ]
        };
        sendMessage(callbackChatId, deleteMessage, buttons);
      } else if (callbackData == "delete_yes") {
        var rowToDelete = parseInt(userData.del_row);
        clearChat(callbackChatId, callbackMessageId);
        var success = deleteDataFromSheet(userSheetName, rowToDelete);

        if (success) {
          sendMessage(callbackChatId, "Data berhasil dihapus.");
          deleteUserData(callbackChatId);
        } else {
          sendMessage(callbackChatId, "Gagal menghapus data.");
          deleteUserData(callbackChatId);
        }
      } else if (callbackData == "delete_no") {
        clearChat(callbackChatId, callbackMessageId);
        sendMessage(callbackChatId, "Proses penghapusan dibatalkan.");
        deleteUserData(callbackChatId);
      } else if (callbackData == "confirm_yes") {
        var name = userData.name;
        var type = userData.type;
        var url = userData.url;
        var row = userData.edit_row;

        var success;
        if (row) {
          success = updateDataInSheet(userSheetName, row, name, type, url);  // Update jika sedang mengedit
        } else {
          success = saveDataToSheet(userSheetName, name, type, url);  // Tambah jika input baru
        }

        clearChat(callbackChatId, callbackMessageId);
        if (success) {
          deleteUserData(callbackChatId);
          sendMessage(callbackChatId, `Data berhasil dimasukkan:\n\nNama: ${name}\nType: ${type}\nUrl: ${url}`);
        } else {
          sendMessage(callbackChatId, "Gagal menyimpan data.");
          deleteUserData(callbackChatId);
        }
      } else if (callbackData == "confirm_no") {
        clearChat(callbackChatId, callbackMessageId);
        sendMessage(callbackChatId, "Proses dibatalkan.");
        deleteUserData(callbackChatId);
      }
    }
  } catch (e) {
    logSheet(e.toString(), "ERROR");
  }
}

// Fungsi untuk menyimpan data pengguna ke PropertiesService
function saveUserData(chatId, userData) {
  var userProps = PropertiesService.getUserProperties();
  userProps.setProperty(chatId, JSON.stringify(userData));
}

// Fungsi untuk mengambil data pengguna dari PropertiesService
function getUserData(chatId) {
  var userProps = PropertiesService.getUserProperties();
  var userData = userProps.getProperty(chatId);
  return userData ? JSON.parse(userData) : null;
}

// Fungsi untuk menghapus data pengguna dari PropertiesService
function deleteUserData(chatId) {
  var userProps = PropertiesService.getUserProperties();
  userProps.deleteProperty(chatId);
}


// Fungsi log ke Google Sheet
function logSheet(message, type) {
  var sheetName = 'Log';
  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(["Timestamp", "Type", "Message"]); // Header
  } else {
    var headers = sheet.getRange(1, 1, 1, 3).getValues()[0];
    if (headers[0] !== "Timestamp" || headers[1] !== "Type" || headers[2] !== "Message") {
      sheet.getRange(1, 1, 1, 3).setValues([["Timestamp", "Type", "Message"]]);
    }
  }

  var timestamp = new Date();
  sheet.appendRow([timestamp, type, message]);
}

function isGroup(chatType) {
  return chatType === 'group' || chatType === 'supergroup';
}

function checkAdminAndPost(chatId, userId) {
  var url = `https://api.telegram.org/bot${token}/getChatMember?chat_id=${chatId}&user_id=${userId}`;
  var response = UrlFetchApp.fetch(url);
  var chatMember = JSON.parse(response.getContentText()).result;

  var isAdminOrOwner = chatMember.status === 'administrator' || chatMember.status === 'creator';

  return isAdminOrOwner;
}

function postAirdropList(chatId) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(userSheetName);
  var data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    sendMessage(chatId, "⛔️ Tidak ada daily tersimpan");
    return;
  }

  var message = `♻️ Daily Recap *${getGroupName(GROUPID)}* ${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy')}\n\n`;

  var groupedData = {};

  // Mengelompokkan data berdasarkan tipe
  for (var i = 1; i < data.length; i++) {  // Mulai dari i=1 untuk menghindari header
    var type = data[i][1];
    var name = data[i][0];
    var url = data[i][2];

    if (!groupedData[type]) {
      groupedData[type] = [];
    }
    groupedData[type].push(`[${name}](${url})`);
  }

  // Menyusun pesan berdasarkan tipe
  for (var type in groupedData) {
    message += `🌀 *${type}*\n`;
    groupedData[type].forEach(function (item) {
      message += `🔹 ${item}\n`;
    });
    message += `\n`;
  }

  sendMessage(chatId, message);
}

function getCurrentDate() {
  var now = new Date();
  var day = String(now.getDate()).padStart(2, '0');
  var month = String(now.getMonth() + 1).padStart(2, '0');
  var year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

function getGroupName(chatId) {
  var url = `https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`;
  var response = UrlFetchApp.fetch(url);
  var chat = JSON.parse(response.getContentText()).result;
  return chat.title;
}

function getEditButtons(sheetName) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  var buttons = [];

  for (var i = 1; i < data.length; i++) {  // Mulai dari i=1 untuk menghindari header
    buttons.push([{ text: data[i][0], callback_data: "edit_" + i }]); // Menambahkan tombol edit
  }

  return { inline_keyboard: buttons };
}

function getDeleteButtons(sheetName) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  var buttons = [];

  for (var i = 1; i < data.length; i++) {  // Mulai dari i=1 untuk menghindari header
    buttons.push([{ text: data[i][0], callback_data: "del_" + i }]); // Menambahkan tombol hapus
  }

  return { inline_keyboard: buttons };
}

function createSheetIfNotExist(sheetName) {
  var ss = SpreadsheetApp.openById(sheetId);
  var sheets = ss.getSheets();
  var sheetExists = sheets.some(function (sheet) {
    return sheet.getName() === sheetName;
  });

  if (!sheetExists) {
    var sheet = ss.insertSheet(sheetName);
    sheet.appendRow(["Nama", "Type", "URL"]); // Header
  }
}

function deleteDataFromSheet(sheetName, rowIndex) {
  try {
    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    sheet.deleteRow(rowIndex + 1);  // Menyesuaikan index
    return true;
  } catch (e) {
    Logger.log(e);
    return false;
  }
}

function getRowData(sheetName, rowIndex) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  return sheet.getRange(rowIndex + 1, 1, 1, 3).getValues()[0];  // Menyesuaikan index
}

function saveDataToSheet(sheetName, name, type, url) {
  try {
    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    sheet.appendRow([name, type, url]);  // Menambahkan data ke akhir sheet
    return true;
  } catch (e) {
    Logger.log(e);
    return false;
  }
}

function updateDataInSheet(sheetName, rowIndex, name, type, url) {
  try {
    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    sheet.getRange(rowIndex + 1, 1, 1, 3).setValues([[name, type, url]]);  // Menyesuaikan index
    return true;
  } catch (e) {
    Logger.log(e);
    return false;
  }
}

function clearChat(chatId, messageId) {
  var url = `https://api.telegram.org/bot${token}/`;
  var data = {
    method: "post",
    payload: {
      method: "deleteMessage",
      chat_id: String(chatId),
      message_id: messageId
    }
  };
  UrlFetchApp.fetch(url, data);
}

function sendEditMessage(chatId, messageId, text, buttons = null) {
  var url = `https://api.telegram.org/bot${token}/`;
  var data = {
    method: "post",
    payload: {
      method: "editMessageText",
      chat_id: String(chatId),
      message_id: String(messageId),
      text: text,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: buttons ? JSON.stringify(buttons) : null
    }
  };
  UrlFetchApp.fetch(url, data);
}

function sendMessage(chatId, text, buttons = null) {
  var url = `https://api.telegram.org/bot${token}/`;
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: text,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: buttons ? JSON.stringify(buttons) : null
    }
  };
  UrlFetchApp.fetch(url, data);
}
