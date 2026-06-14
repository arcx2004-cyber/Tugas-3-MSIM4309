/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

// ============================================
// Vue Component: Topbar / Header
// Komponen ini menangani header bar dengan
// judul halaman, search box, dan tombol aksi.
// Menggunakan v-model, v-if, v-show, $emit,
// dan event handler keyboard (@keyup.enter).
// ============================================

Vue.component('topbar-component', {
  // Props: menerima konfigurasi dari parent
  props: {
    title: {
      type: String,
      required: true
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    showAddButton: {
      type: Boolean,
      default: false
    },
    addButtonText: {
      type: String,
      default: 'Tambah Baru'
    }
  },
  data: function() {
    return {
      searchKeyword: ''
    };
  },
  methods: {
    // Method: emit event pencarian ke parent
    handleSearch: function() {
      this.$emit('search', this.searchKeyword);
    },
    // Method: emit event klik tombol tambah ke parent
    handleAddClick: function() {
      this.$emit('add-click');
    },
    // Method: handle keyboard event Enter untuk search
    onSearchEnter: function() {
      this.handleSearch();
    },
    // Method: handle keyboard event Esc untuk clear search
    onSearchEsc: function() {
      this.searchKeyword = '';
      this.handleSearch();
    }
  },
  // Template: menggunakan Vue template string
  template: '\
    <header class="topbar">\
      <div class="topbar-title" v-text="title"></div>\
      <div class="topbar-actions">\
        <div class="search-box" v-show="showSearch">\
          <i class="ph ph-magnifying-glass"></i>\
          <input type="text"\
                 placeholder="Cari data..."\
                 v-model="searchKeyword"\
                 @keyup.enter="onSearchEnter"\
                 @keyup.esc="onSearchEsc"\
                 @input="handleSearch">\
        </div>\
        <i class="ph ph-bell" style="font-size: 1.25rem; cursor: pointer;" v-show="showSearch"></i>\
        <button class="btn btn-primary" v-if="showAddButton" @click="handleAddClick">\
          <i class="ph ph-plus"></i> {{ addButtonText }}\
        </button>\
      </div>\
    </header>\
  '
});
