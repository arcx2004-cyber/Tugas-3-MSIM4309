/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

// ============================================
// Registrasi Vue Filters Global
// ============================================

Vue.filter('capitalize', function(value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter('rupiah', function(value) {
  if (!value && value !== 0) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
});

Vue.filter('uppercase', function(value) {
  if (!value) return '';
  return value.toString().toUpperCase();
});

Vue.filter('truncate', function(value, length) {
  if (!value) return '';
  length = length || 30;
  if (value.length <= length) return value;
  return value.substring(0, length) + '...';
});

// ============================================
// Vue Instance: Pemesanan (pemesanan.html)
// Menggunakan komponen sidebar-component,
// topbar-component, stat-card-component,
// dan pemesanan-card-component.
// ============================================

var app = new Vue({
  el: '#app',
  data: {
    // Data list bahan ajar untuk dropdown form (dari API)
    stokBahanAjar: [],

    // Filter status pemesanan
    filterStatus: '',

    // Data simulasi pemesanan masuk
    pemesananData: [
      {
        noPemesanan: "PO2025-001",
        nim: "052784116",
        nama: "Agus Sutikno",
        tanggal: "2025-09-01",
        status: "Pending",
        alamat: "Jl. Percetakan Negara No. 10, Jayapura, Papua",
        items: [
          { kode: "EKMA4116", judul: "Pengantar Manajemen", qty: 2, harga: 65000 },
          { kode: "EKMA4115", judul: "Pengantar Akuntansi", qty: 1, harga: 60000 }
        ],
        totalHarga: 190000
      },
      {
        noPemesanan: "PO2025-002",
        nim: "123456789",
        nama: "Rina Wulandari",
        tanggal: "2025-09-02",
        status: "Pending",
        alamat: "Jl. Merdeka No. 45, Jakarta Selatan, DKI Jakarta",
        items: [
          { kode: "BIOL4201", judul: "Biologi Umum (Praktikum)", qty: 1, harga: 80000 }
        ],
        totalHarga: 80000
      },
      {
        noPemesanan: "PO2025-003",
        nim: "987654321",
        nama: "Budi Santoso",
        tanggal: "2025-09-03",
        status: "Pending",
        alamat: "Jl. Ahmad Yani No. 12, Surabaya, Jawa Timur",
        items: [
          { kode: "EKMA4116", judul: "Pengantar Manajemen", qty: 1, harga: 65000 },
          { kode: "FISIP4001", judul: "Dasar-Dasar Sosiologi", qty: 1, harga: 55000 },
          { kode: "BIOL4201", judul: "Biologi Umum (Praktikum)", qty: 1, harga: 80000 }
        ],
        totalHarga: 200000
      },
      {
        noPemesanan: "PO2025-004",
        nim: "111222333",
        nama: "Siti Nurhaliza",
        tanggal: "2025-08-28",
        status: "Diproses",
        alamat: "Jl. Diponegoro No. 78, Makassar, Sulawesi Selatan",
        items: [
          { kode: "EKMA4115", judul: "Pengantar Akuntansi", qty: 2, harga: 60000 }
        ],
        totalHarga: 120000
      },
      {
        noPemesanan: "PO2025-005",
        nim: "444555666",
        nama: "Ahmad Fadli",
        tanggal: "2025-08-25",
        status: "Selesai",
        alamat: "Jl. Sudirman No. 100, Padang, Sumatera Barat",
        items: [
          { kode: "FISIP4001", judul: "Dasar-Dasar Sosiologi", qty: 1, harga: 55000 }
        ],
        totalHarga: 55000
      },
      {
        noPemesanan: "PO2025-006",
        nim: "777888999",
        nama: "Dewi Lestari",
        tanggal: "2025-08-30",
        status: "Ditolak",
        alamat: "Jl. Gatot Subroto No. 55, Denpasar, Bali",
        items: [
          { kode: "EKMA4116", judul: "Pengantar Manajemen", qty: 3, harga: 65000 }
        ],
        totalHarga: 195000
      }
    ],

    // Kata kunci pencarian
    searchKeyword: ''
  },

  mounted: function() {
    var self = this;
    // Mengambil data stok menggunakan API Service
    if (window.apiService) {
      window.apiService.fetchData().then(function(data) {
        if (data) {
          self.stokBahanAjar = data.stok || [];
        }
      });
    }
  },

  computed: {
    // Computed property: data yang sudah difilter berdasarkan status dan keyword
    filteredPemesanan: function() {
      var result = this.pemesananData;

      // Filter berdasarkan status
      if (this.filterStatus) {
        var status = this.filterStatus;
        result = result.filter(function(order) {
          return order.status === status;
        });
      }

      // Filter berdasarkan keyword pencarian
      if (this.searchKeyword) {
        var keyword = this.searchKeyword.toLowerCase();
        result = result.filter(function(order) {
          return order.noPemesanan.toLowerCase().indexOf(keyword) !== -1 ||
                 order.nama.toLowerCase().indexOf(keyword) !== -1 ||
                 order.nim.indexOf(keyword) !== -1;
        });
      }

      return result;
    },

    // Computed property: jumlah pesanan pending
    totalPending: function() {
      return this.pemesananData.filter(function(o) {
        return o.status === 'Pending';
      }).length;
    },

    // Computed property: jumlah pesanan diproses
    totalDiproses: function() {
      return this.pemesananData.filter(function(o) {
        return o.status === 'Diproses';
      }).length;
    },

    // Computed property: jumlah pesanan selesai
    totalSelesai: function() {
      return this.pemesananData.filter(function(o) {
        return o.status === 'Selesai';
      }).length;
    },

    // Computed property: total nilai semua pesanan pending
    totalNilaiPending: function() {
      return this.pemesananData
        .filter(function(o) { return o.status === 'Pending'; })
        .reduce(function(sum, o) { return sum + o.totalHarga; }, 0);
    }
  },

  watch: {
    // Watcher 1: log saat filter status berubah
    filterStatus: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log('Filter status berubah dari', oldVal, 'ke', newVal);
      }
    },
    // Watcher 2: memantau jumlah pesanan pending
    totalPending: function(newVal) {
      if (newVal === 0) {
        console.log('Semua pesanan pending telah diproses!');
      }
    }
  },

  methods: {
    // Method: proses pesanan (ubah status ke Diproses)
    prosesPesanan: function(order) {
      var idx = this.pemesananData.findIndex(function(o) {
        return o.noPemesanan === order.noPemesanan;
      });
      if (idx !== -1) {
        this.$set(this.pemesananData[idx], 'status', 'Diproses');
      }
    },

    // Method: tolak pesanan
    tolakPesanan: function(order) {
      var idx = this.pemesananData.findIndex(function(o) {
        return o.noPemesanan === order.noPemesanan;
      });
      if (idx !== -1) {
        if (confirm('Yakin ingin menolak pesanan ' + order.noPemesanan + '?')) {
          this.$set(this.pemesananData[idx], 'status', 'Ditolak');
        }
      }
    },

    // Method: handle search dari topbar
    handleSearch: function(keyword) {
      this.searchKeyword = keyword;
    },

    // Method: reset filter
    resetFilter: function() {
      this.filterStatus = '';
      this.searchKeyword = '';
    },

    // Method: format Rupiah
    formatRupiah: function(angka) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
    }
  }
});
