/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

// ============================================
// Registrasi Vue Filters Global
// Filter digunakan untuk formatting data teks
// pada template Vue (mustaches pipe syntax).
// Didaftarkan sebelum instance Vue dibuat.
// ============================================

// Filter: capitalize — mengubah huruf pertama menjadi kapital
Vue.filter('capitalize', function(value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

// Filter: rupiah — format angka ke mata uang Rupiah
Vue.filter('rupiah', function(value) {
  if (!value && value !== 0) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
});

// Filter: uppercase — mengubah seluruh teks menjadi huruf kapital
Vue.filter('uppercase', function(value) {
  if (!value) return '';
  return value.toString().toUpperCase();
});

// Filter: truncate — memotong teks yang terlalu panjang
Vue.filter('truncate', function(value, length) {
  if (!value) return '';
  length = length || 30;
  if (value.length <= length) return value;
  return value.substring(0, length) + '...';
});

// ============================================
// Vue Instance: Dashboard (index.html)
// Menggunakan komponen sidebar-component,
// topbar-component, dan stat-card-component.
// ============================================

var app = new Vue({
  el: '#app',
  data: {
    // Data dari JSON
    stok: [],
    trackingData: [],
    
    // Data pemesanan pending (sinkron dengan pemesanan-app.js)
    pemesananPending: 3,
    // Data Papan Pengumuman
    pengumuman: [
      {
        judul: "Jadwal Distribusi Semester Ganjil 2025/2026",
        isi: "Distribusi bahan ajar untuk semester ganjil tahun akademik 2025/2026 dimulai tanggal 1 September 2025. Pastikan seluruh stok telah dipersiapkan.",
        tanggal: "01 Sep 2025",
        prioritas: "penting"
      },
      {
        judul: "Pembaruan Sistem Inventory v2.5",
        isi: "Sistem inventory telah diupdate ke versi 2.5 dengan fitur tracking real-time dan notifikasi otomatis untuk stok menipis.",
        tanggal: "28 Ags 2025",
        prioritas: "info"
      },
      {
        judul: "Libur Nasional - Hari Kemerdekaan RI",
        isi: "Operasional gudang dan distribusi diliburkan pada tanggal 17 Agustus 2025. Aktivitas normal kembali pada 18 Agustus.",
        tanggal: "15 Ags 2025",
        prioritas: "umum"
      },
      {
        judul: "Stok Bahan Ajar EKMA4115 Terbatas",
        isi: "Persediaan buku Pengantar Akuntansi (EKMA4115) sudah di bawah safety stock. Segera lakukan reorder ke penerbit.",
        tanggal: "10 Ags 2025",
        prioritas: "penting"
      }
    ],
    // State untuk modal tambah pengumuman
    showPengumumanModal: false,
    currentTime: new Date()
  },
  computed: {
    // Computed property: total keseluruhan stok buku
    totalStok: function() {
      return this.stok.reduce(function(sum, item) {
        return sum + item.qty;
      }, 0);
    },
    // Computed property: total pengiriman aktif
    totalPengiriman: function() {
      return this.trackingData.length;
    },
    // Computed property: total pesanan pending
    totalPending: function() {
      return this.pemesananPending;
    },
    // Computed property: nama hari dalam Bahasa Indonesia
    hari: function() {
      var days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      return days[this.currentTime.getDay()];
    },
    // Computed property: format tanggal Indonesia
    tanggal: function() {
      var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      var date = this.currentTime.getDate();
      var month = months[this.currentTime.getMonth()];
      var year = this.currentTime.getFullYear();
      return date + ' ' + month + ' ' + year;
    },
    // Computed property: format jam (HH:MM:SS)
    jam: function() {
      var h = this.currentTime.getHours().toString().padStart(2, '0');
      var m = this.currentTime.getMinutes().toString().padStart(2, '0');
      var s = this.currentTime.getSeconds().toString().padStart(2, '0');
      return h + ':' + m + ':' + s;
    },
    // Computed property: sapaan berdasarkan waktu
    sapaan: function() {
      var hour = this.currentTime.getHours();
      if (hour >= 4 && hour < 11) {
        return "Selamat Pagi";
      } else if (hour >= 11 && hour < 15) {
        return "Selamat Siang";
      } else if (hour >= 15 && hour < 18) {
        return "Selamat Sore";
      } else {
        return "Selamat Malam";
      }
    }
  },
  methods: {
    // Method: Menambah pengumuman baru dari modal
    addPengumuman: function(newInfo) {
      // Masukkan di urutan pertama (paling atas)
      this.pengumuman.unshift(newInfo);
    },
    // Method: Menghapus pengumuman berdasarkan index
    deletePengumuman: function(index) {
      if (confirm('Yakin ingin menghapus pengumuman ini?')) {
        this.pengumuman.splice(index, 1);
      }
    }
  },
  mounted: function() {
    var self = this;
    
    // Mengambil data dari JSON menggunakan API Service
    if (window.apiService) {
      window.apiService.fetchData().then(function(data) {
        if (data) {
          self.stok = data.stok || [];
          self.trackingData = data.trackingTransformed || [];
        }
      });
    }

    // Update jam setiap detik
    setInterval(function() {
      self.currentTime = new Date();
    }, 1000);
  }
});
