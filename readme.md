# 🌸 AyumiAPIS (歩美)

> Solusi REST API yang **ringan, modular, dan dibuat dengan Express.js**. Didesain untuk pengembangan yang cepat dan mudah di-deploy ke **Vercel**. Ideal untuk proyek pribadi, integrasi AI, dan layanan *backend* yang efisien.
>
> **Ayumi (歩美)**, memiliki arti "Langkah yang indah," merefleksikan arsitektur kode yang terstruktur dan mudah diikuti.

![AyumiAPIS Thumbnail](https://files.catbox.moe/ali6lb.jpg)

***

## ✨ Fitur Utama

Proyek ini menawarkan berbagai *endpoint* API, berfokus pada **Tools (Perkakas)** dan **AI (Kecerdasan Buatan)**, yang didokumentasikan sepenuhnya dengan Swagger UI.

### 🤖 Layanan AI (Didukung oleh Google Gemini)
* **Google Search AI (`/api/ai/google-search`)**: Mencari informasi terkini dari web menggunakan Gemini AI.
* **Google Code Execution AI (`/api/ai/google-execute`)**: Mengeksekusi kode berdasarkan permintaan natural language, ideal untuk perhitungan kompleks dan tugas pemrograman.
* **Google Maps AI (`/api/ai/google-maps`)**: Memberikan jawaban kontekstual yang didasarkan pada data geografis Google Maps (mendukung preset lokasi global).

### 🛠️ Layanan Tools
* **Speed Test (`/api/tools/speedtest`)**: Melakukan tes kecepatan unggah dan ping, serta mendapatkan informasi geolokasi jaringan (server dan penyedia).
* **API Gateway & Keamanan**: Dilengkapi dengan **Helmet** (untuk header keamanan), **CORS**, **Rate Limiting** (`100 req/15 min`), dan mekanisme deteksi IP asli.
* **Logging**: Menggunakan `pino-http` untuk *logging* yang cepat dan opsional mengirim log akses API ke **Discord Webhook**.
* **Dokumentasi Otomatis**: Menyediakan *playground* interaktif menggunakan Swagger UI pada endpoint `/playground`.

***

## ⚙️ Teknologi yang Digunakan

| Kategori | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) | Environment runtime utama. |
| **Web Framework** | ![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white) | Kerangka kerja web yang cepat dan minimalis. |
| **AI** | `@google/genai` | Integrasi dengan model Google Gemini. |
| **Database** | `mongodb`, `redis` | Dukungan koneksi untuk data dan caching. |
| **Keamanan** | `helmet`, `hpp`, `xss-clean` | Lapisan keamanan standar industri. |
| **Utility** | `axios`, `multer`, `pino` | HTTP client, pengolah *multipart/form-data*, dan *logger* berkinerja tinggi. |

***

## 📋 Prasyarat Instalasi

Pastikan Anda memiliki [Node.js](https://nodejs.org/en/) versi **>=20.0.0**.

### 📦 Langkah Instalasi

1.  **Clone Repository:**
    ```bash
    git clone [https://github.com/Liwirya/Base-Apis.git](https://github.com/Liwirya/Base-Apis.git)
    cd Base-Apis
    ```

2.  **Install Dependensi:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment (Opsional):**
    Buat file `.env` di root proyek untuk menyimpan kunci API dan konfigurasi sensitif.
    ```env
    # Wajib untuk layanan AI
    GEMINI_API_KEY="AIzaSyAuYU2ZTgbNuPFSSoelmgr3cLQfal3tNjA" 
    
    # Opsional untuk logging
    DISCORD_WEBHOOK_URL="[https://discord.com/api/webhooks/](https://discord.com/api/webhooks/)..."
    
    # Opsional untuk mengubah port
    PORT=1904
    ```

***

## 🚀 Menjalankan Proyek

### 🔹 Mode Produksi (Start)
```bash
npm start 
# Akses API di: http://localhost:1904 (atau port di config)
````

### 🔸 Mode Pengembangan (Dev)

Mode ini menggunakan `nodemon` untuk *auto-restart* saat ada perubahan file.

```bash
npm run dev
```

### 💡 Mengakses Dokumentasi

Buka browser dan navigasi ke:

```
http://localhost:1904/playground
```

-----

## 💻 Contoh Penggunaan API

Berikut adalah contoh permintaan menggunakan `curl`:

### 1\. Google Search AI

Mencari pemenang turnamen Euro 2024.

```bash
curl -X GET "http://localhost:1904/api/ai/google-search?query=Siapa%20pemenang%20Euro%202024%3F"
```

### 2\. Google Code Execution AI

Meminta AI untuk menghitung deret bilangan prima.

```bash
curl -X GET "http://localhost:1904/api/ai/google-execute?query=Jumlahkan%2050%20bilangan%20prima%20pertama%2C%20dan%20tampilkan%20kode%20eksekusinya"
```

### 3\. Speed Test

Melakukan tes kecepatan unggah.

```bash
curl -X GET "http://localhost:1904/api/tools/speedtest?query=upload"
```

*(Catatan: Query `upload` atau `ping` bersifat opsional. Jika kosong, akan menjalankan semua tes.)*

-----

## 🗂️ Struktur Proyek

```
AyumiAPIS/
├── index.js              # File entry point (menyiapkan Express, middleware, routes)
├── router/
│   └── api.js            # Mendefinisikan semua endpoint API
├── schema/
│   ├── config.js         # Konfigurasi umum (nama, port, URL host)
│   └── endpoint.js       # Konfigurasi Swagger UI (Dokumentasi API)
├── scrapers/
│   ├── ai.js             # Implementasi fungsi-fungsi AI (Gemini)
│   └── tools.js          # Implementasi fungsi-fungsi Tools (speedtest, dll)
├── lib/
│   └── print.js          # Utilitas untuk logging dan animasi konsol
├── resources/
│   ├── 404.html          # Halaman 404 kustom
│   └── index.html        # Landing page kustom (Root path "/")
├── package.json
└── vercel.json           # Konfigurasi untuk deployment Vercel
```

-----

## 🤝 Kontribusi

Kami sangat menghargai kontribusi Anda\! Jika Anda memiliki ide perbaikan, fitur baru, atau menemukan *bug*, silakan:

1.  *Fork* repository ini.
2.  Buat *branch* baru: `git checkout -b fitur-keren`.
3.  Lakukan perubahan dan *commit* Anda: `git commit -m 'Menambahkan fitur keren'`.
4.  *Push* ke *branch*: `git push origin fitur-keren`.
5.  Buka *Pull Request*.

-----

## 📄 Lisensi

Proyek ini dilisensikan di bawah **Lisensi MIT**.

**MIT License**

Copyright (c) 2025 Liwirya

