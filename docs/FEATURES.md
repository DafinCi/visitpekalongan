# Fitur & Roadmap: VisitPekalongan

Dokumen ini memetakan spesifikasi fitur platform **VisitPekalongan**, mulai dari rilis Minimum Viable Product (MVP) hingga rencana pengembangan jangka panjang.

---

## 1. Fase 1: MVP (Peluncuran Inti)

Fokus fase ini adalah menghadirkan direktori kurasi independen yang cepat, berkarakter *Modern Heritage*, ramah seluler (*mobile-first*), serta langsung menjawab kebutuhan pengguna dalam menemukan tempat autentik.

### A. Eksplorasi & Filter Cerdas

- **Pencarian Teks Instan:** Pencarian cepat tanpa muat ulang halaman untuk nama tempat, menu signature (misal: *soto tauto*, *kopi tahlil*, *garang asem*), dan nama kecamatan (misal: *Petungkriyono*, *Pekalongan Barat*).
- **Pil Filter Suasana (Vibe Pills):** Filter satu ketukan berdasarkan suasana tempat:
  - *Kopi & Nugas (WFC Friendly)*
  - *Kuliner Legendaris*
  - *Hawa Dingin & Alam*
  - *Heritage & Batik*
- **Filter Wilayah (Kota vs Kabupaten):** Pengelompokan cepat antara wilayah perkotaan pesisir dan dataran tinggi pegunungan.
- **Sinkronisasi Parameter URL (`nuqs`):** Status pencarian, kategori, suasana, dan koordinat aktif otomatis tercermin di URL peramban, memudahkan pengguna membagikan tautan hasil kurasi spesifik ke WhatsApp atau media sosial.

### B. Tampilan Feed & Peta Interaktif

- **Mode Tampilan Ganda (Dual View Mode):** Tombol aksi mengambang di bagian bawah layar untuk beralih instan antara **Tampilan Daftar (Grid)** dan **Peta Interaktif (MapLibre GL)**.
- **Kartu Tempat Artisanal (Spot Cards):**
  - Foto suasana berasio 4:3 dengan efek pembesaran lembut saat disentuh atau disorot kursor.
  - Lencana kategori dan suasana berdesain stempel keramik.
  - Indikator status operasional otomatis: lencana **"Buka Sekarang"** atau **"Tutup"** yang dikalkulasi secara waktu nyata berdasarkan jadwal harian.
  - Tanda menu khas (*Signature Dish*) langsung di kartu (misal: *"Wajib coba: Kopi Tahlil Rempah"*).
  - Tautan langsung satu ketukan menuju navigasi aplikasi Google Maps untuk rute presisi.
  - Tautan langsung satu ketukan menuju akun profil Instagram resmi pengelola spot.
- **Peta Interaktif (MapLibre GL):**
  - Menggunakan vector tiles berlatar belakang lembut selaras warna kanvas mori (`#F7F5F0`).
  - Pin penanda (*custom marker*) berbasis kategori tempat.
  - **Laci Bawah Ringkasan (Bottom Drawer Preview):** Mengetuk pin di peta akan memunculkan laci bawah berisi ringkasan info spot tanpa menutup tampilan peta secara penuh.

### C. Halaman Detail Tempat (`/spot/[slug]`)

- **Galeri Foto Suasana:** Foto beresolusi tinggi dalam format AVIF/WebP teroptimasi dengan rasio aspek seimbang.
- **Narasi Kurasi:** Ulasan cerita di balik tempat, sejarah singkat, atau keunikan rasa yang membedakannya dari tempat lain.
- **Waktu Kunjungan Terbaik (Best Time to Visit):** Rekomendasi momen ideal berkunjung (misal: *"Paling syahdu saat kabut turun jam 15:30"*).
- **Informasi Operasional Lengkap:**
  - Jadwal jam buka rinci untuk setiap hari (Senin hingga Minggu).
  - Indikator rentang harga lokal: *Murah Meriah* (< Rp 15rb), *Terjangkau* (Rp 15rb - Rp 35rb), atau *Kafe/Spesial* (> Rp 35rb).
  - Deretan lencana fasilitas (WiFi kencang, colokan listrik, area merokok, mushola nyaman, parkir mobil/motor, pendingin udara).
- **Aksi Cepat:** Tombol salin tautan (*Share Link*) dan tombol panduan rute navigasi.

---

## 2. Fase 2: Keterlibatan Komunitas & Ketahanan Offline

Fokus fase ini adalah memperluas basis data secara organik lewat warga lokal dan memastikan aplikasi tetap bermanfaat saat pelancong berada di daerah lereng pegunungan.

- **Formulir "Lapor Hidden Gem" (Community Submission):**
  - Laci formulir interaktif bagi warga lokal untuk mengirimkan rekomendasi spot baru.
  - Masukan meliputi: Nama spot, kategori, kecamatan, deskripsi alasan rekomendasi, menu khas, tautan Google Maps, serta kontak pengusul.
  - Data yang masuk berstatus *pending* dalam tabel `spot_submissions` hingga disetujui melalui kurasi admin internal.
- **Bookmark / Simpan Tempat Favorit:**
  - Fitur simpan tempat tanpa perlu proses registrasi akun (tersimpan di peramban pengguna via *LocalStorage*).
  - Tab khusus *"Tempat Tersimpan"* untuk menyusun daftar kunjungan sebelum memulai perjalanan.
- **Ketahanan Offline Ringan (Offline Resilience):**
  - Penyimpanan otomatis untuk data tempat yang telah dibuka ke memori peramban, sehingga rute dan deskripsi tempat di kawasan Petungkriyono tetap dapat dibaca meski ponsel kehilangan sinyal internet.
- **Pengurutan Berdasarkan Jarak (Geolocation Sort):**
  - Tombol deteksi izin lokasi peramban untuk mengurutkan daftar spot dari titik terdekat pengguna saat berada di teritori Pekalongan.

---

## 3. Fase 3: Rute Tematik & Eksplorasi Lanjutan

- **Jalur Seharian (Curated Mini Itinerary):** Rute perjalanan tematik siap tempuh (contoh: *"Sehari Menjelajah Petungkriyono: Dari Kopi Omah hingga Curug Bajing"*, *"Jelajah Kuliner Malam Pesisir Kota Batik"*).
- **Widget Cuaca & Ketinggian:** Indikator suhu, prakiraan cuaca, dan ketinggian lokasi otomatis, khusus untuk spot wisata alam di kawasan pegunungan selatan.
- **Dukungan PWA Penuh:** Instalasi aplikasi ke layar utama ponsel (*Add to Home Screen*) dengan kemampuan kerja luring yang lebih komprehensif.
