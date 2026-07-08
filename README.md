# 🍃 EcoPoin - Digital Waste Bank Platform

**Ubah Sampahmu Jadi GreenCoin, Ciptakan Lingkungan yang Lebih Bersih!**

EcoPoin adalah platform bank sampah digital cerdas yang dirancang untuk mempermudah masyarakat dalam mengelola sampah daur ulang. Dengan pendekatan *gamification* dan insentif finansial, EcoPoin mengonversi sampah yang disetorkan pengguna menjadi **GreenCoin** yang dapat ditukarkan dengan berbagai kebutuhan sehari-hari maupun dicairkan ke E-Wallet.

Website ini bertindak sebagai **Landing Page** sekaligus **Admin Dashboard** untuk mengelola operasional sistem EcoPoin secara komprehensif.

---

## ✨ Layanan & Fitur Utama

Aplikasi EcoPoin menawarkan ekosistem pengelolaan sampah yang terintegrasi melalui fitur-fitur berikut:

- 🚛 **EcoPick** — Layanan penjemputan sampah langsung ke rumah (*door-to-door*) oleh kurir, tanpa repot.
- ♻️ **EcoDrop** — Layanan penyetoran sampah harian secara mandiri ke titik bank sampah (*drop point*) terdekat.
- 🪙 **GreenCoin & EPoints** — Sistem reward utama. Dapatkan koin dari setiap gram sampah yang disetor untuk kemudian dicairkan ke saldo E-Wallet (GoPay, OVO, Dana, ShopeePay).
- 🛒 **Market** — Tukarkan GreenCoin kamu dengan berbagai bahan produk rumah tangga (sembako) yang tersedia di dalam sistem.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

Proyek ini dibangun dengan teknologi modern web development untuk memastikan performa yang cepat dan antarmuka yang responsif:

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** Supabase Auth (Row Level Security Enabled)
- **Hosting/Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Panduan Instalasi (Local Development)

Untuk menjalankan proyek EcoPoin di komputer lokal (localhost), ikuti langkah-langkah berikut:

### 1. Clone Repository

```bash
git clone https://github.com/rizqy-fadhil/ecopoin-web.git
cd ecopoin-web
```

### 2. Install Dependencies

Pastikan Node.js sudah terinstal, lalu jalankan:

```bash
npm install
```

### 3. Setup Environment Variables

Buat file baru bernama `.env.local` di root direktori proyek, lalu isi dengan konfigurasi API Key Supabase kamu:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[PUBLISHABLE-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[SECRET-ROLE-KEY]
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi.

---

## 🌐 Live Preview (Deployment)

Proyek ini telah di-deploy secara otomatis menggunakan sistem CI/CD Vercel. Kunjungi versi production yang sudah tayang di sini:

👉 [EcoPoin Website Live](https://ecopoin-web.vercel.app)

---

## 👥 Tim Pengembang (Kelompok 9)

Proyek ini dikembangkan secara kolaboratif untuk memenuhi tugas akhir mata kuliah:

- **Rizqy Fadhil Athallah** — Frontend Developer & UI/UX
- **Andana** — Developer
- **Hariz** — Developer
- **Faisal** — Developer

---

<p align="center">Dibuat dengan 💚 di Surabaya untuk lingkungan yang lebih baik.</p>
