SOP Engine adalah "Command Center" berbasis web untuk mendokumentasikan, melihat, dan berinteraksi dengan Standard Operating Procedures (SOP) internal tim. Sistem ini menggunakan arsitektur **App Shell** yang sangat ringan, di mana file HTML dan PDF di-load secara dinamis dari folder tanpa memerlukan _backend_ database.

## 📁 Struktur Direktori

Sistem ini sangat bergantung pada struktur folder. Pastikan repositori kamu memiliki susunan seperti berikut:

``` ascii
/
├── index.html                   <-- Engine Utama (Jangan diubah strukturnya, hanya edit sopRegistry)
├── README.md                    <-- Dokumen ini
└── SOPs/                        <-- Folder utama penyimpanan SOP
    ├── /Nama SOP Folder 1/
    │     ├── content.html       <-- Konten interaktif web
    │     └── document.pdf       <-- File PDF asli
    └── /Nama SOP Folder 2/
          ├── content.html
          └── document.pdf
```

## 🛠️ Cara Menambahkan SOP Baru

Menambahkan SOP baru sangat mudah dan tidak memerlukan _re-build_ aplikasi. Ikuti 3 langkah berikut:

### Langkah 1: Buat Folder Baru

Buat folder baru di dalam direktori `SOPs/`. Beri nama yang jelas, misalnya `SOPs/Deployment Pipeline V2/`.

### Langkah 2: Isi Folder Tersebut

Masukkan dua file wajib ke dalam folder yang baru dibuat:
1. `document.pdf` (File SOP aslimu).
2. `content.html` (Konten web interaktif).
    

**Contoh Template `content.html`:** Kamu bisa langsung menggunakan komponen UI yang sudah disediakan oleh _engine_. Cukup _copy-paste_ kode di bawah ini ke dalam `content.html`:

``` html
<!-- Intro Paragraph -->
<p class="text-xl text-slate-300 leading-relaxed italic border-l-4 border-cyan-500 pl-6 mb-8">
    Tulis deskripsi singkat tentang SOP ini di sini.
</p>

<!-- Peringatan / Highlight (style: bg-yellow/blue/green) -->
<div class="glass p-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 text-yellow-200 flex gap-4 my-6">
    <i data-lucide="alert-triangle" class="w-5 h-5 text-yellow-500 shrink-0 mt-0.5"></i>
    <div>
        <h5 class="text-xs font-bold uppercase tracking-widest mb-1 text-yellow-500">Peringatan Penting</h5>
        <p class="text-sm opacity-80">Tulis peringatan atau instruksi kritis di sini.</p>
    </div>
</div>

<!-- Checklist -->
<div class="glass p-6 rounded-2xl space-y-4 mb-6">
    <h4 class="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Checklist Persiapan</h4>
    <label class="flex items-center gap-4 text-sm text-slate-400 cursor-pointer hover:text-white">
        <input type="checkbox" class="accent-cyan-500 w-4 h-4 rounded-md bg-slate-900 border-white/10">
        <span>Langkah 1: Cek server status.</span>
    </label>
</div>

<!-- Code Block -->
<div class="space-y-4">
    <div class="flex justify-between items-center">
        <h4 class="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Command Eksekusi</h4>
        <span class="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-cyan-400 uppercase border border-white/10">BASH</span>
    </div>
    <div class="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
        <pre class="p-6 text-sm overflow-x-auto"><code class="text-cyan-300">npm run build && pm2 restart all</code></pre>
    </div>
</div>
```

### Langkah 3: Daftarkan SOP di `index.html`

Buka file `index.html`, cari variabel `const sopRegistry = { ... }` di dalam tag `<script>`. Tambahkan folder barumu ke dalamnya:

``` js
const sopRegistry = {
    // ... SOP lama ...
    
    // Tambahkan entri baru ini:
    "id-unik-sop-kamu": {
        title: "Judul SOP yang Muncul di Sidebar",
        category: "Engineering", // Kategori grouping di sidebar
        updated: "15 Mei 2026",
        severity: "medium", // Pilihan: low, medium, high, critical
        folderPath: "SOPs/Deployment Pipeline V2" // <-- PASTIKAN PATH INI BENAR
    }
};
```

Selesai! Saat kamu me-_refresh_ web, SOP barumu akan otomatis muncul di _sidebar_.

## ⚠️ Notes Penting & Troubleshooting

### 1. Masalah CORS (Konten HTML Tidak Muncul)

Karena sistem ini melakukan _fetching_ (mengambil) file HTML dari folder lokal, _browser_ modern akan memblokirnya karena alasan keamanan jika kamu membuka file dengan cara di-klik dua kali (`file:///C:/path/to/index.html`).

**Solusi:**

- **Local Development:** Gunakan ekstensi **Live Server** di VS Code. Klik Kanan `index.html` -> _Open with Live Server_. Web akan terbuka di `http://localhost:5500`.
    
- **Production:** Hosting repositori ini menggunakan **GitHub Pages**, **Vercel**, atau **Netlify**. Sistem akan berjalan normal tanpa _error_ CORS.
    

### 2. Mengubah Komponen UI `content.html`

Sistem ini menggunakan **Tailwind CSS**. Kamu bebas menggunakan semua _utility classes_ Tailwind di dalam `content.html`. Icon menggunakan library **Lucide Icons** (`<i data-lucide="nama-icon"></i>`). Cek daftar icon di [lucide.dev](https://lucide.dev/ "null").

### 3. Error: "File content.html tidak ditemukan"

Jika peringatan ini muncul di web:

- Cek apakah ada _typo_ pada `folderPath` di `index.html`.
- Pastikan nama file benar-benar `content.html` dan `document.pdf` (huruf kecil semua).
- Pastikan spasi pada nama folder sama persis.
    

### 4. Menambah Kategori Baru

Untuk membuat kategori baru di sidebar (misalnya "Human Resources"), kamu cukup mengisi `category: "Human Resources"` pada saat mendaftarkan SOP di `sopRegistry`. Engine akan otomatis membaca dan membuatkan _group/header_ kategori tersebut di sidebar.