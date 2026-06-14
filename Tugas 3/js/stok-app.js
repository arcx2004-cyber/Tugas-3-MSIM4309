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
// Vue Instance: Manajemen Stok (stok.html)
// Menggunakan komponen sidebar-component,
// topbar-component, stok-table-component,
// dan stok-modal-component.
// ============================================

var app = new Vue({
  el: '#app',
  data: {
    // Data dari JSON
    upbjjList: [],
    kategoriList: [],
    stok: [],

    // State modal
    showModal: false,
    modalMode: 'add', // 'add' atau 'edit'
    selectedItem: null,

    // Form Model
    formData: {
      kode: '', judul: '', kategori: '', upbjj: '',
      lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: ''
    }
  },

  mounted: function() {
    var self = this;
    // Mengambil data dari JSON menggunakan API Service
    if (window.apiService) {
      window.apiService.fetchData().then(function(data) {
        if (data) {
          self.upbjjList = data.upbjjList || [];
          self.kategoriList = data.kategoriList || [];
          self.stok = data.stok || [];
        }
      });
    }
  },

  methods: {
    // Method: buka modal tambah stok baru
    openAddModal: function() {
      this.editMode = false;
      this.editIndex = -1;
      this.formData = {
        kode: '', judul: '', kategori: '', upbjj: '',
        lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: ''
      };
      this.showModal = true;
    },

    // Method: buka modal edit stok
    openEditModal: function(item) {
      this.editMode = true;
      this.editIndex = this.stok.findIndex(function(s) {
        return s.kode === item.kode;
      });
      this.formData = Object.assign({}, item);
      this.showModal = true;
    },

    // Method: tutup modal
    closeModal: function() {
      this.showModal = false;
    },

    // Method: simpan stok (dari event emit komponen modal)
    saveStok: function(formData) {
      if (this.editMode && this.editIndex !== -1) {
        // Edit: menggunakan Vue.set agar reaktif
        this.$set(this.stok, this.editIndex, Object.assign({}, formData));
      } else {
        // Tambah baru
        this.stok.push(Object.assign({}, formData));
      }
      this.closeModal();
    },

    // Method: handle search dari topbar (mouse/keyboard event)
    handleSearch: function(keyword) {
      // Search functionality — dapat diperluas
      console.log('Search keyword:', keyword);
    }
  }
});
