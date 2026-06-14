/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

// ============================================
// Helper: Load Template dari file HTML terpisah
// Menggunakan XMLHttpRequest sinkron agar
// komponen dapat diregistrasi sebelum Vue instance.
// Ini memenuhi requirement soal: template dipisah
// ke folder /templates/ sebagai file .html mandiri.
// ============================================
function loadTemplate(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false); // synchronous
  xhr.send(null);
  if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
    return xhr.responseText;
  }
  console.error('Gagal memuat template:', url);
  return '<div style="color:red;">Template gagal dimuat: ' + url + '</div>';
}

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
// REGISTRASI VUE COMPONENTS
// Setiap komponen memuat template dari file
// HTML terpisah di folder /templates/
// menggunakan fungsi loadTemplate().
// Nama komponen menggunakan kebab-case
// sesuai konvensi soal (contoh: <sidebar-component>).
// ============================================

// --- 1. Sidebar Component ---
Vue.component('sidebar-component', {
  props: {
    activePage: { type: String, required: true }
  },
  data: function() {
    return {
      menuItems: [
        { label: 'Dashboard', icon: 'ph ph-squares-four', page: 'dashboard' },
        { label: 'Manajemen Stok', icon: 'ph ph-warehouse', page: 'stok' },
        { label: 'Tracking DO', icon: 'ph ph-map-pin-line', page: 'tracking' },
        { label: 'Pemesanan', icon: 'ph ph-shopping-cart', page: 'pemesanan' }
      ]
    };
  },
  template: loadTemplate('templates/sidebar.html')
});

// --- 2. Topbar Component ---
Vue.component('topbar-component', {
  props: {
    title: { type: String, required: true },
    showSearch: { type: Boolean, default: true },
    showAddButton: { type: Boolean, default: false },
    addButtonText: { type: String, default: 'Tambah Baru' }
  },
  data: function() {
    return { searchKeyword: '' };
  },
  methods: {
    handleSearch: function() { this.$emit('search', this.searchKeyword); },
    handleAddClick: function() { this.$emit('add-click'); },
    onSearchEnter: function() { this.handleSearch(); },
    onSearchEsc: function() { this.searchKeyword = ''; this.handleSearch(); }
  },
  template: loadTemplate('templates/topbar.html')
});

// --- 3. Stat Card Component ---
Vue.component('stat-card-component', {
  props: {
    title: { type: String, required: true },
    value: { type: [Number, String], required: true },
    subtitle: { type: String, default: '' },
    icon: { type: String, default: '' },
    clickable: { type: Boolean, default: false },
    href: { type: String, default: '' },
    bigValue: { type: [Number, String], default: '' },
    valueLabel: { type: String, default: '' },
    showTrend: { type: Boolean, default: false }
  },
  computed: {
    cardStyle: function() {
      return { cursor: this.clickable ? 'pointer' : 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
    }
  },
  methods: {
    handleClick: function() {
      if (this.clickable && this.href) { window.location.href = this.href; }
    }
  },
  template: loadTemplate('templates/stat-card.html')
});

// --- 4. Stok Table Component ---
Vue.component('stok-table-component', {
  props: {
    stok: { type: Array, required: true },
    upbjjList: { type: Array, required: true },
    kategoriList: { type: Array, required: true }
  },
  data: function() {
    return {
      filterDaerah: '', filterKategori: '', filterStatus: '', sortBy: '',
      hoveredItem: null // untuk tooltip hover catatanHTML
    };
  },
  computed: {
    // Computed: filter & sort tidak recompute selama dependency tidak berubah
    filteredStok: function() {
      var result = this.stok;
      if (this.filterDaerah) {
        var daerah = this.filterDaerah;
        result = result.filter(function(item) { return item.upbjj === daerah; });
      }
      // Dependent: kategori hanya aktif jika daerah sudah dipilih
      if (this.filterKategori) {
        var kategori = this.filterKategori;
        result = result.filter(function(item) { return item.kategori === kategori; });
      }
      if (this.filterStatus === 'kritis') {
        result = result.filter(function(item) { return item.qty < item.safety || item.qty === 0; });
      }
      if (this.sortBy === 'judul') {
        result = result.slice().sort(function(a, b) { return a.judul.localeCompare(b.judul); });
      } else if (this.sortBy === 'qty') {
        result = result.slice().sort(function(a, b) { return a.qty - b.qty; });
      } else if (this.sortBy === 'harga') {
        result = result.slice().sort(function(a, b) { return a.harga - b.harga; });
      }
      return result;
    },
    totalSKU: function() { return this.filteredStok.length; }
  },
  watch: {
    // Watcher: reset kategori saat daerah berubah (dependent dropdown)
    filterDaerah: function(newVal, oldVal) {
      if (newVal !== oldVal) { this.filterKategori = ''; }
    }
  },
  methods: {
    resetFilter: function() {
      this.filterDaerah = ''; this.filterKategori = ''; this.filterStatus = ''; this.sortBy = '';
    },
    editItem: function(item) { this.$emit('edit-item', item); },
    deleteItem: function(item) {
      if (confirm('Apakah Anda yakin ingin menghapus bahan ajar ' + item.kode + ' (' + item.judul + ')?')) {
        this.$emit('delete-item', item);
      }
    }
  },
  template: loadTemplate('templates/stok-table.html')
});

// --- 5. Stok Modal Component ---
Vue.component('stok-modal-component', {
  props: {
    show: { type: Boolean, default: false },
    editMode: { type: Boolean, default: false },
    formData: { type: Object, default: function() { return { kode:'',judul:'',kategori:'',upbjj:'',lokasiRak:'',harga:0,qty:0,safety:0,catatanHTML:'' }; } },
    kategoriList: { type: Array, required: true },
    upbjjList: { type: Array, required: true }
  },
  data: function() {
    return { form: Object.assign({}, this.formData) };
  },
  watch: {
    // Watcher: sinkronisasi prop formData ke local form
    formData: { handler: function(newVal) { this.form = Object.assign({}, newVal); }, deep: true },
    // Watcher: validasi qty tidak boleh negatif
    'form.qty': function(newVal) { if (newVal < 0) this.form.qty = 0; },
    // Watcher: validasi safety tidak boleh negatif
    'form.safety': function(newVal) { if (newVal < 0) this.form.safety = 0; }
  },
  methods: {
    save: function() {
      if (!this.form.kode || !this.form.judul) { alert('Kode dan Judul tidak boleh kosong!'); return; }
      this.$emit('save', Object.assign({}, this.form));
    },
    close: function() { this.$emit('close'); },
    handleKeydown: function(e) { if (e.key === 'Escape') this.close(); }
  },
  mounted: function() { document.addEventListener('keydown', this.handleKeydown); },
  beforeDestroy: function() { document.removeEventListener('keydown', this.handleKeydown); },
  template: loadTemplate('templates/stok-modal.html')
});

// --- 6. Tracking Card Component ---
Vue.component('tracking-card-component', {
  props: {
    doItem: { type: Object, required: true }
  },
  methods: {
    // Method: format tanggal ISO ke format Indonesia "25 Agustus 2025"
    formatTanggal: function(tanggalStr) {
      if (!tanggalStr) return '-';
      var bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
      var d = new Date(tanggalStr);
      return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
    },
    formatRupiah: function(angka) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
    }
  },
  template: loadTemplate('templates/tracking-card.html')
});

// --- 7. Tracking Modal Component ---
Vue.component('tracking-modal-component', {
  props: {
    show: { type: Boolean, default: false },
    generatedDO: { type: String, required: true },
    paketList: { type: Array, required: true },
    pengirimanList: { type: Array, required: true }
  },
  data: function() {
    return { form: { nim:'', nama:'', ekspedisi:'', paket:'', tanggalKirim:'' }, detailPaketHTML: '' };
  },
  computed: {
    // Computed: total harga dari paket yang dipilih
    selectedTotalHarga: function() {
      if (!this.form.paket) return 0;
      var selected = this.paketList.find(function(p) { return p.kode === this.form.paket; }.bind(this));
      return selected ? selected.harga : 0;
    }
  },
  watch: {
    // Watcher: update detail paket HTML saat pilihan berubah
    'form.paket': function(newVal) {
      if (!newVal) { this.detailPaketHTML = ''; return; }
      var selected = this.paketList.find(function(p) { return p.kode === newVal; });
      if (selected) {
        this.detailPaketHTML = '<strong>Isi Paket:</strong><ul>' +
          selected.isi.map(function(item) { return '<li>' + item + '</li>'; }).join('') + '</ul>';
      }
    },
    // Watcher: reset form saat modal dibuka
    show: function(newVal) { if (newVal) this.resetForm(); }
  },
  methods: {
    resetForm: function() {
      var d = new Date();
      var month = '' + (d.getMonth() + 1); var day = '' + d.getDate(); var year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      this.form = { nim:'', nama:'', ekspedisi:'', paket:'', tanggalKirim: [year,month,day].join('-') };
      this.detailPaketHTML = '';
    },
    saveDO: function() {
      if (!this.form.nim || !this.form.nama || !this.form.ekspedisi || !this.form.paket || !this.form.tanggalKirim) {
        alert('Mohon lengkapi semua field formulir!'); return;
      }
      this.$emit('save', { formData: Object.assign({}, this.form), totalHarga: this.selectedTotalHarga });
    },
    close: function() { this.$emit('close'); },
    handleKeydown: function(e) { if (e.key === 'Escape') this.close(); }
  },
  mounted: function() { document.addEventListener('keydown', this.handleKeydown); },
  beforeDestroy: function() { document.removeEventListener('keydown', this.handleKeydown); },
  template: loadTemplate('templates/tracking-modal.html')
});

// --- 8. Progress Modal Component ---
Vue.component('progress-modal-component', {
  props: {
    show: { type: Boolean, required: true },
    doItem: { type: Object, default: null }
  },
  data: function() { return { formData: { keterangan: '' }, errors: {} }; },
  methods: {
    closeModal: function() { this.formData.keterangan = ''; this.errors = {}; this.$emit('close'); },
    saveData: function() {
      this.errors = {};
      if (!this.formData.keterangan.trim()) {
        this.$set(this.errors, 'keterangan', 'Keterangan progress wajib diisi'); return;
      }
      var d = new Date();
      var months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
      var waktu = d.getDate().toString().padStart(2,'0') + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ' ' + d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
      var newProgress = { waktu: waktu, keterangan: this.formData.keterangan };
      this.$emit('save', { nomorDO: this.doItem.nomorDO, progress: newProgress });
      this.closeModal();
    }
  },
  template: loadTemplate('templates/progress-modal.html')
});

// --- 9. Pemesanan Card Component ---
Vue.component('pemesanan-card-component', {
  props: {
    order: { type: Object, required: true }
  },
  computed: {
    badgeClass: function() {
      switch (this.order.status) {
        case 'Pending': return 'badge badge-menipis';
        case 'Diproses': return 'badge badge-aman';
        case 'Ditolak': return 'badge badge-kritis';
        case 'Selesai': return 'badge badge-aman';
        default: return 'badge badge-menipis';
      }
    },
    totalItems: function() { return this.order.items.length; }
  },
  methods: {
    prosesPesanan: function() { this.$emit('proses', this.order); },
    tolakPesanan: function() { this.$emit('tolak', this.order); },
    formatRupiah: function(angka) { return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR'}).format(angka); }
  },
  template: loadTemplate('templates/pemesanan-card.html')
});

// --- 10. Pengumuman Modal Component ---
Vue.component('pengumuman-modal-component', {
  props: { show: { type: Boolean, required: true } },
  data: function() { return { formData: { judul:'', isi:'', prioritas:'umum' }, errors: {} }; },
  methods: {
    closeModal: function() { this.resetForm(); this.$emit('close'); },
    validateForm: function() {
      this.errors = {};
      var isValid = true;
      if (!this.formData.judul.trim()) { this.$set(this.errors, 'judul', 'Judul wajib diisi'); isValid = false; }
      if (!this.formData.isi.trim()) { this.$set(this.errors, 'isi', 'Isi pengumuman wajib diisi'); isValid = false; }
      return isValid;
    },
    saveData: function() {
      if (this.validateForm()) {
        var months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
        var d = new Date();
        var dateStr = d.getDate().toString().padStart(2,'0') + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
        this.$emit('save', { judul: this.formData.judul, isi: this.formData.isi, prioritas: this.formData.prioritas, tanggal: dateStr });
        this.closeModal();
      }
    },
    resetForm: function() { this.formData = { judul:'', isi:'', prioritas:'umum' }; this.errors = {}; }
  },
  template: loadTemplate('templates/pengumuman-modal.html')
});


// ============================================
// VUE ROOT INSTANCE — Single Page Application
// Tab-based routing: tab = 'dashboard' | 'stok' | 'tracking' | 'pemesanan'
// Semua data terpusat di root, diteruskan ke
// komponen anak via props dan events ($emit).
// ============================================

var app = new Vue({
  el: '#app',
  data: {
    // --- Tab State (routing) ---
    activeTab: 'dashboard',

    // --- Data dari JSON (di-load via API Service) ---
    upbjjList: [],
    kategoriList: [],
    pengirimanList: [],
    paket: [],
    stok: [],
    trackingData: [],

    // --- Stok State ---
    showStokModal: false,
    stokEditMode: false,
    stokEditIndex: -1,
    stokFormData: { kode:'', judul:'', kategori:'', upbjj:'', lokasiRak:'', harga:0, qty:0, safety:0, catatanHTML:'' },
    stokSearchKeyword: '',

    // --- Tracking State ---
    showTrackingAddModal: false,
    showProgressModal: false,
    selectedDO: null,
    trackingSearchQuery: '',

    // --- Pemesanan State ---
    filterStatus: '',
    searchKeyword: '',
    pemesananData: [
      { noPemesanan:"PO2025-001", nim:"052784116", nama:"Agus Sutikno", tanggal:"2025-09-01", status:"Pending", alamat:"Jl. Percetakan Negara No. 10, Jayapura, Papua", items:[ {kode:"EKMA4116",judul:"Pengantar Manajemen",qty:2,harga:65000},{kode:"EKMA4115",judul:"Pengantar Akuntansi",qty:1,harga:60000} ], totalHarga:190000 },
      { noPemesanan:"PO2025-002", nim:"123456789", nama:"Rina Wulandari", tanggal:"2025-09-02", status:"Pending", alamat:"Jl. Merdeka No. 45, Jakarta Selatan, DKI Jakarta", items:[ {kode:"BIOL4201",judul:"Biologi Umum (Praktikum)",qty:1,harga:80000} ], totalHarga:80000 },
      { noPemesanan:"PO2025-003", nim:"987654321", nama:"Budi Santoso", tanggal:"2025-09-03", status:"Pending", alamat:"Jl. Ahmad Yani No. 12, Surabaya, Jawa Timur", items:[ {kode:"EKMA4116",judul:"Pengantar Manajemen",qty:1,harga:65000},{kode:"FISIP4001",judul:"Dasar-Dasar Sosiologi",qty:1,harga:55000},{kode:"BIOL4201",judul:"Biologi Umum (Praktikum)",qty:1,harga:80000} ], totalHarga:200000 },
      { noPemesanan:"PO2025-004", nim:"111222333", nama:"Siti Nurhaliza", tanggal:"2025-08-28", status:"Diproses", alamat:"Jl. Diponegoro No. 78, Makassar, Sulawesi Selatan", items:[ {kode:"EKMA4115",judul:"Pengantar Akuntansi",qty:2,harga:60000} ], totalHarga:120000 },
      { noPemesanan:"PO2025-005", nim:"444555666", nama:"Ahmad Fadli", tanggal:"2025-08-25", status:"Selesai", alamat:"Jl. Sudirman No. 100, Padang, Sumatera Barat", items:[ {kode:"FISIP4001",judul:"Dasar-Dasar Sosiologi",qty:1,harga:55000} ], totalHarga:55000 },
      { noPemesanan:"PO2025-006", nim:"777888999", nama:"Dewi Lestari", tanggal:"2025-08-30", status:"Ditolak", alamat:"Jl. Gatot Subroto No. 55, Denpasar, Bali", items:[ {kode:"EKMA4116",judul:"Pengantar Manajemen",qty:3,harga:65000} ], totalHarga:195000 }
    ],

    // --- Dashboard State ---
    pengumuman: [
      { judul:"Jadwal Distribusi Semester Ganjil 2025/2026", isi:"Distribusi bahan ajar untuk semester ganjil tahun akademik 2025/2026 dimulai tanggal 1 September 2025.", tanggal:"01 Sep 2025", prioritas:"penting" },
      { judul:"Pembaruan Sistem Inventory v2.5", isi:"Sistem inventory telah diupdate ke versi 2.5 dengan fitur tracking real-time dan notifikasi otomatis.", tanggal:"28 Ags 2025", prioritas:"info" },
      { judul:"Libur Nasional - Hari Kemerdekaan RI", isi:"Operasional gudang dan distribusi diliburkan pada tanggal 17 Agustus 2025.", tanggal:"15 Ags 2025", prioritas:"umum" },
      { judul:"Stok Bahan Ajar EKMA4115 Terbatas", isi:"Persediaan buku Pengantar Akuntansi (EKMA4115) sudah di bawah safety stock. Segera reorder.", tanggal:"10 Ags 2025", prioritas:"penting" }
    ],
    showPengumumanModal: false,
    currentTime: new Date()
  },

  computed: {
    // --- Dashboard ---
    totalStok: function() { return this.stok.reduce(function(s,i){return s+i.qty;},0); },
    totalPengiriman: function() { return this.trackingData.length; },
    totalPending: function() { return this.pemesananData.filter(function(o){return o.status==='Pending';}).length; },
    hari: function() { return ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][this.currentTime.getDay()]; },
    tanggal: function() {
      var m = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
      return this.currentTime.getDate()+' '+m[this.currentTime.getMonth()]+' '+this.currentTime.getFullYear();
    },
    jam: function() {
      return this.currentTime.getHours().toString().padStart(2,'0')+':'+this.currentTime.getMinutes().toString().padStart(2,'0')+':'+this.currentTime.getSeconds().toString().padStart(2,'0');
    },
    sapaan: function() {
      var h = this.currentTime.getHours();
      if (h>=4&&h<11) return "Selamat Pagi";
      if (h>=11&&h<15) return "Selamat Siang";
      if (h>=15&&h<18) return "Selamat Sore";
      return "Selamat Malam";
    },

    // --- Tracking ---
    generatedDO: function() {
      var y = new Date().getFullYear();
      var seq = (this.trackingData.length + 1).toString().padStart(3,'0');
      return "DO" + y + "-" + seq;
    },
    filteredTracking: function() {
      if (!this.trackingSearchQuery) return this.trackingData;
      var q = this.trackingSearchQuery.toLowerCase();
      return this.trackingData.filter(function(i) { return i.nomorDO.toLowerCase().includes(q)||i.nim.toLowerCase().includes(q); });
    },

    // --- Pemesanan ---
    filteredPemesanan: function() {
      var result = this.pemesananData;
      if (this.filterStatus) { var st=this.filterStatus; result=result.filter(function(o){return o.status===st;}); }
      if (this.searchKeyword) { var kw=this.searchKeyword.toLowerCase(); result=result.filter(function(o){return o.noPemesanan.toLowerCase().indexOf(kw)!==-1||o.nama.toLowerCase().indexOf(kw)!==-1||o.nim.indexOf(kw)!==-1;}); }
      return result;
    },
    totalDiproses: function() { return this.pemesananData.filter(function(o){return o.status==='Diproses';}).length; },
    totalSelesai: function() { return this.pemesananData.filter(function(o){return o.status==='Selesai';}).length; },
    totalNilaiPending: function() { return this.pemesananData.filter(function(o){return o.status==='Pending';}).reduce(function(s,o){return s+o.totalHarga;},0); },

    // --- Topbar title berdasarkan tab ---
    topbarTitle: function() {
      var titles = { dashboard:'Dashboard Utama', stok:'Manajemen Stok Bahan Ajar', tracking:'Tracking Pengiriman DO', pemesanan:'Pemesanan Bahan Ajar' };
      return titles[this.activeTab] || 'Dashboard';
    },
    topbarAddButton: function() { return this.activeTab === 'stok' || this.activeTab === 'tracking'; },
    topbarAddText: function() { return this.activeTab === 'stok' ? 'Tambah Stok Baru' : 'Pengiriman Baru (DO)'; }
  },

  // --- WATCHERS (Indikator 5: minimal 2) ---
  watch: {
    // Watcher 1: log perubahan filter status pemesanan
    filterStatus: function(newVal, oldVal) {
      if (newVal !== oldVal) console.log('Filter status berubah dari', oldVal, 'ke', newVal);
    },
    // Watcher 2: notifikasi saat semua pesanan pending diproses
    totalPending: function(newVal) {
      if (newVal === 0) console.log('Semua pesanan pending telah diproses!');
    }
  },

  methods: {
    // --- Tab Navigation ---
    navigateTab: function(tab) { this.activeTab = tab; },

    // --- Dashboard ---
    addPengumuman: function(info) { this.pengumuman.unshift(info); },
    deletePengumuman: function(idx) { if(confirm('Yakin ingin menghapus pengumuman ini?')) this.pengumuman.splice(idx,1); },

    // --- Stok ---
    openAddStokModal: function() {
      this.stokEditMode = false; this.stokEditIndex = -1;
      this.stokFormData = { kode:'', judul:'', kategori:'', upbjj:'', lokasiRak:'', harga:0, qty:0, safety:0, catatanHTML:'' };
      this.showStokModal = true;
    },
    openEditStokModal: function(item) {
      this.stokEditMode = true;
      this.stokEditIndex = this.stok.findIndex(function(s){return s.kode===item.kode;});
      this.stokFormData = Object.assign({}, item);
      this.showStokModal = true;
    },
    saveStok: function(formData) {
      if (this.stokEditMode && this.stokEditIndex !== -1) {
        this.$set(this.stok, this.stokEditIndex, Object.assign({}, formData));
      } else {
        this.stok.push(Object.assign({}, formData));
      }
      this.showStokModal = false;
    },
    deleteStok: function(item) {
      var idx = this.stok.findIndex(function(s){return s.kode===item.kode;});
      if (idx !== -1) this.stok.splice(idx, 1);
    },

    // --- Tracking ---
    openAddTrackingModal: function() { this.showTrackingAddModal = true; },
    saveDO: function(payload) {
      var newDO = {
        nomorDO: this.generatedDO, nim: payload.formData.nim, nama: payload.formData.nama,
        status: "Order Placed", ekspedisi: payload.formData.ekspedisi,
        tanggalKirim: payload.formData.tanggalKirim, paket: payload.formData.paket,
        total: payload.totalHarga,
        timeline: [{ waktu: new Date().toISOString().replace('T',' ').substring(0,19), keterangan: "Order Placed" }]
      };
      this.trackingData.unshift(newDO);
      this.showTrackingAddModal = false;
    },
    openProgressModal: function(doItem) { this.selectedDO = doItem; this.showProgressModal = true; },
    saveProgress: function(payload) {
      var idx = this.trackingData.findIndex(function(i){return i.nomorDO===payload.nomorDO;});
      if (idx !== -1) {
        this.trackingData[idx].timeline.push(payload.progress);
        this.$set(this.trackingData[idx], 'status', payload.progress.keterangan);
      }
    },

    // --- Pemesanan ---
    prosesPesanan: function(order) {
      var idx = this.pemesananData.findIndex(function(o){return o.noPemesanan===order.noPemesanan;});
      if (idx !== -1) this.$set(this.pemesananData[idx], 'status', 'Diproses');
    },
    tolakPesanan: function(order) {
      var idx = this.pemesananData.findIndex(function(o){return o.noPemesanan===order.noPemesanan;});
      if (idx !== -1 && confirm('Yakin ingin menolak pesanan '+order.noPemesanan+'?')) this.$set(this.pemesananData[idx], 'status', 'Ditolak');
    },
    resetFilter: function() { this.filterStatus = ''; this.searchKeyword = ''; },

    // --- Search Handlers ---
    handleStokSearch: function(kw) { this.stokSearchKeyword = kw; },
    handleTrackingSearch: function(q) { if(q!==undefined) this.trackingSearchQuery = q; },
    handlePemesananSearch: function(kw) { this.searchKeyword = kw; },

    // --- Topbar Add Button ---
    handleAddClick: function() {
      if (this.activeTab === 'stok') this.openAddStokModal();
      else if (this.activeTab === 'tracking') this.openAddTrackingModal();
    },
    handleTopbarSearch: function(kw) {
      if (this.activeTab === 'stok') this.handleStokSearch(kw);
      else if (this.activeTab === 'tracking') this.handleTrackingSearch(kw);
      else if (this.activeTab === 'pemesanan') this.handlePemesananSearch(kw);
    }
  },

  mounted: function() {
    var self = this;
    // Load data dari JSON via API Service
    if (window.apiService) {
      window.apiService.fetchData().then(function(data) {
        if (data) {
          self.upbjjList = data.upbjjList || [];
          self.kategoriList = data.kategoriList || [];
          self.pengirimanList = data.pengirimanList || [];
          self.paket = data.paket || [];
          self.stok = data.stok || [];
          self.trackingData = data.trackingTransformed || [];
        }
      });
    }
    // Update jam real-time setiap detik
    setInterval(function() { self.currentTime = new Date(); }, 1000);
  }
});
