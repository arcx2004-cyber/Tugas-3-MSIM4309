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
// ============================================

// Filter: capitalize
Vue.filter('capitalize', function(value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

// Filter: rupiah
Vue.filter('rupiah', function(value) {
  if (!value && value !== 0) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
});

// Filter: uppercase
Vue.filter('uppercase', function(value) {
  if (!value) return '';
  return value.toString().toUpperCase();
});

// Filter: truncate
Vue.filter('truncate', function(value, length) {
  if (!value) return '';
  length = length || 30;
  if (value.length <= length) return value;
  return value.substring(0, length) + '...';
});

// ============================================
// Vue Instance: Tracking DO (tracking.html)
// Menggunakan komponen sidebar-component,
// topbar-component, tracking-card-component,
// dan tracking-modal-component.
// ============================================

var app = new Vue({
  el: '#app',
  data: {
    // Data List dari JSON
    pengirimanList: [],
    paket: [],

    // State modal dan pencarian
    showAddModal: false,
    showProgressModal: false,
    selectedDO: null,
    searchQuery: '',

    // Data DO Aktif (dari JSON)
    trackingData: []
  },

  mounted: function() {
    var self = this;
    // Mengambil data menggunakan API Service
    if (window.apiService) {
      window.apiService.fetchData().then(function(data) {
        if (data) {
          self.pengirimanList = data.pengirimanList || [];
          self.paket = data.paket || [];
          self.trackingData = data.trackingTransformed || [];
        }
      });
    }
  },

  computed: {
    // Computed property: Generate Nomor DO otomatis
    generatedDO: function() {
      var d = new Date();
      var year = d.getFullYear();
      var sequence = this.trackingData.length + 1;
      var seqStr = sequence.toString().padStart(3, '0');
      return "DO" + year + "-" + seqStr;
    },
    // Computed property untuk fitur pencarian
    filteredTracking: function() {
      if (!this.searchQuery) {
        return this.trackingData;
      }
      var query = this.searchQuery.toLowerCase();
      return this.trackingData.filter(function(item) {
        return item.nomorDO.toLowerCase().includes(query) || 
               item.nim.toLowerCase().includes(query);
      });
    }
  },

  methods: {
    // Method: buka modal tambah DO baru
    openAddModal: function() {
      this.showAddModal = true;
    },

    // Method: tutup modal
    closeModal: function() {
      this.showAddModal = false;
      this.showProgressModal = false;
    },

    // Method: simpan DO baru (dari event emit komponen modal)
    saveDO: function(payload) {
      var formData = payload.formData;
      var totalHarga = payload.totalHarga;

      var newDO = {
        nomorDO: this.generatedDO,
        nim: formData.nim,
        nama: formData.nama,
        status: "Order Placed",
        ekspedisi: formData.ekspedisi,
        tanggalKirim: formData.tanggalKirim,
        paket: formData.paket,
        total: totalHarga,
        timeline: [
          {
            waktu: new Date().toISOString().replace('T', ' ').substring(0, 19),
            keterangan: "Order Placed"
          }
        ]
      };

      // Data baru diletakkan di paling atas (unshift)
      this.trackingData.unshift(newDO);
      this.showAddModal = false;
    },

    // Method: handle pencarian dari topbar
    handleSearch: function(query) {
      if (query === undefined) return;
      this.searchQuery = query;
    },

    // Method: Buka modal tambah progress
    openProgressModal: function(doItem) {
      this.selectedDO = doItem;
      this.showProgressModal = true;
    },

    // Method: Simpan data progress ke DO spesifik
    saveProgress: function(payload) {
      var index = this.trackingData.findIndex(function(item) {
        return item.nomorDO === payload.nomorDO;
      });
      if (index !== -1) {
        // Tambahkan ke timeline paling bawah
        this.trackingData[index].timeline.push(payload.progress);
        
        // Update status summary (menggunakan keterangan terbaru)
        this.trackingData[index].status = payload.progress.keterangan;
      }
    },

    // Method: format Rupiah
    formatRupiah: function(angka) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
    }
  }
});
