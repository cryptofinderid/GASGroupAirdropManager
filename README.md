# Telegram Bot with Google Sheets Integration

A Telegram bot that manages user input and stores it in Google Sheets. This bot is capable of adding, editing, and deleting entries while offering a daily summary feature. Deploy it with Google Apps Script to create your own bot-powered management tool!

---

## 🚀 Deploying to Google Apps Script

Follow these steps to get your bot up and running on Google Apps Script:

### Step 1: Create a Telegram Bot

1. Open Telegram and search for the [BotFather](https://telegram.me/BotFather).
2. Use the command `/newbot` to create a new bot.
3. Set the bot name and username, then copy the generated **API Token**.

### Step 2: Set Up Google Sheets

1. Create a new Google Spreadsheet.
2. Note the **Spreadsheet ID** from the URL, which looks like: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}`.

### Step 3: Deploy the Bot on Google Apps Script

1. Open [Google Apps Script](https://script.google.com/).
2. Create a new project, and replace the code with the script provided.
3. In the code, replace:
   - `TELEGRAM_BOT_TOKEN` with your bot token.
   - `SPREADSHEET_ID` with your Google Spreadsheet ID.
4. Click **Deploy** > **New Deployment** and select **Web App**.
5. Set access to **Anyone**, then deploy.
6. Copy the **Web App URL**.

### Step 4: Set the Webhook

Use the following URL to set the webhook for your bot:

```bash
https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/setWebhook?url=<YOUR_WEB_APP_URL>
```

Replace `<YOUR_TELEGRAM_BOT_TOKEN>` with your bot token and `<YOUR_WEB_APP_URL>` with the Google Apps Script Web App URL.

---

## 🤖 Bot Commands & Features

Here are the commands and features you can use with your bot:

| Command   | Description                                                                                           | Perintah   | Deskripsi                                                                                               |
|-----------|-------------------------------------------------------------------------------------------------------|------------|---------------------------------------------------------------------------------------------------------|
| `/start`  | Starts the bot and creates a personal sheet for the user.                                              | `/start`   | Memulai bot dan membuat sheet personal untuk pengguna.                                                   |
| `/add`    | Initiates the process to add new data (Name, Type, URL).                                               | `/add`     | Memulai proses menambahkan data baru (Nama, Tipe, URL).                                                  |
| `/edit`   | Allows the user to edit existing data in their personal sheet.                                         | `/edit`    | Memungkinkan pengguna mengedit data yang sudah ada di sheet mereka.                                      |
| `/del`    | Allows the user to delete data from their sheet.                                                       | `/del`     | Memungkinkan pengguna menghapus data dari sheet mereka.                                                  |
| `/daily`  | Posts a daily recap of user data to the group (admins only).                                           | `/daily`   | Mengirimkan rekap harian dari data pengguna ke grup (hanya admin).                                        |
| `/cancel` | Cancels the current process.                                                                           | `/cancel`  | Membatalkan proses saat ini.                                                                             |

---

## ✨ Key Features

- **Inline Keyboard for Confirmations**: When adding or editing data, users are prompted with a confirmation message and interactive buttons to proceed or cancel.
- **Data Persistence**: All user data is stored in Google Sheets for easy access and management.
- **Group Admin Commands**: Certain commands like `/daily` are restricted to admins, ensuring control over group functionality.

---

## 🎨 Additional Features in the Code

- **Logging**: Each action is logged into a dedicated `Log` sheet to track errors and successful actions.
- **Inline Editing and Deleting**: Users can easily select which data to edit or delete via interactive inline buttons.
- **Multi-step Input**: Data is entered in steps (Name, Type, URL) ensuring a structured and organized input process.

---

## 📸 Screenshots (Optional)

| Feature          | Preview |
|------------------|---------|
| Adding Data      | ![Add Data](https://link-to-screenshot) |
| Editing Data     | ![Edit Data](https://link-to-screenshot) |
| Daily Recap      | ![Daily Recap](https://link-to-screenshot) |

---

## 🛠 Creator

This bot is created and maintained by [@cryptofinderid](https://t.me/cryptofinderid). Feel free to reach out for any inquiries or improvements!

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## Bahasa Indonesia 🇮🇩

Bot Telegram ini mengelola input pengguna dan menyimpan data di Google Sheets. Bot ini mendukung penambahan, pengeditan, penghapusan data, dan fitur rekap harian yang bisa digunakan dalam grup.

---

## 🚀 Cara Deploy di Google Apps Script

Ikuti langkah-langkah di bawah ini untuk menjalankan bot:

### Langkah 1: Buat Bot Telegram

1. Buka Telegram dan cari [BotFather](https://telegram.me/BotFather).
2. Gunakan perintah `/newbot` untuk membuat bot baru.
3. Tentukan nama dan username bot, lalu salin **Token API** yang dihasilkan.

### Langkah 2: Buat Google Sheets

1. Buat Spreadsheet baru di Google Sheets.
2. Catat **Spreadsheet ID** dari URL seperti: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}`.

### Langkah 3: Deploy Bot di Google Apps Script

1. Buka [Google Apps Script](https://script.google.com/).
2. Buat proyek baru, dan ganti kode dengan script yang disediakan.
3. Ganti:
   - `TELEGRAM_BOT_TOKEN` dengan token bot Anda.
   - `SPREADSHEET_ID` dengan Spreadsheet ID Google Anda.
4. Klik **Deploy** > **New Deployment** dan pilih **Web App**.
5. Set akses menjadi **Anyone**, kemudian deploy.
6. Salin **Web App URL**.

### Langkah 4: Set Webhook

Gunakan URL berikut untuk mengatur webhook bot:

```bash
https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/setWebhook?url=<YOUR_WEB_APP_URL>
```

Ganti `<YOUR_TELEGRAM_BOT_TOKEN>` dengan token bot Anda dan `<YOUR_WEB_APP_URL>` dengan URL Web App Google Apps Script.

---

## 🤖 Perintah Bot & Fitur

Berikut adalah perintah yang bisa Anda gunakan:

| Command   | Description                                                                                           | Perintah   | Deskripsi                                                                                               |
|-----------|-------------------------------------------------------------------------------------------------------|------------|---------------------------------------------------------------------------------------------------------|
| `/start`  | Memulai bot dan membuat sheet personal untuk pengguna.                                                 | `/start`   | Memulai bot dan membuat sheet personal untuk pengguna.                                                   |
| `/add`    | Memulai proses menambahkan data baru (Nama, Tipe, URL).                                                | `/add`     | Memulai proses menambahkan data baru (Nama, Tipe, URL).                                                  |
| `/edit`   | Memungkinkan pengguna mengedit data yang sudah ada di sheet mereka.                                    | `/edit`    | Memungkinkan pengguna mengedit data yang sudah ada di sheet mereka.                                      |
| `/del`    | Memungkinkan pengguna menghapus data dari sheet mereka.                                                | `/del`     | Memungkinkan pengguna menghapus data dari sheet mereka.                                                  |
| `/daily`  | Mengirimkan rekap harian dari data pengguna ke grup (hanya admin).                                     | `/daily`   | Mengirimkan rekap harian dari data pengguna ke grup (hanya admin).                                        |
| `/cancel` | Membatalkan proses saat ini.                                                                           | `/cancel`  | Membatalkan proses saat ini.                                                                             |

---

## ✨ Fitur Utama

- **Keyboard Inline untuk Konfirmasi**: Pengguna mendapatkan pesan konfirmasi dengan tombol interaktif untuk melanjutkan atau membatalkan proses.
- **Penyimpanan Data**: Semua data pengguna disimpan di Google Sheets untuk akses dan manajemen yang mudah.
- **Perintah Admin Grup**: Beberapa perintah seperti `/daily` hanya bisa dijalankan oleh admin untuk menjaga kendali fungsi grup.

---

## ✨ Fitur Tambahan

- **Logging**: Setiap tindakan dicatat di sheet `Log` untuk memantau kesalahan dan tindakan sukses.
- **Pengeditan dan Penghapusan Inline**: Pengguna dapat memilih data untuk diedit atau dihapus melalui tombol interaktif.
- **Input Multi-tahap**: Data dimasukkan secara bertahap (Nama, Tipe, URL) agar lebih terstruktur.

---

## ✉️ Creator

Dibuat oleh [@cryptofinderid](https://t.me/cryptofinderid). Jangan ragu untuk menghubungi untuk pertanyaan atau saran perbaikan!

---

Enjoy building your Telegram bot!
