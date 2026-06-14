/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

// ============================================
// Vue Component: Stok Table (Tabel Stok)
// Komponen ini menampilkan tabel data stok
// dengan fitur filter dan sort. Menggunakan:
// v-for (list rendering array), v-if/v-else-if/v-else
// (conditional badge status), v-text, v-html,
// v-model, v-show, computed property, watcher,
// methods, dan filter formatting teks.
// ============================================

Vue.component('stok-table-component', {
  // Props: menerima data dan state filter dari parent
  props: {
    stok: {
      type: Array,
      required: true
    },
    upbjjList: {
      type: Array,
      required: true
    },
    kategoriList: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      // State filter lokal
      filterDaerah: '',
      filterKategori: '',
      filterStatus: '',
      sortBy: ''
    };
  },
  computed: {
    // Computed property: menghasilkan data yang sudah di-filter dan di-sort
    filteredStok: function() {
      var result = this.stok;

      // Filter UT-Daerah
      if (this.filterDaerah) {
        var daerah = this.filterDaerah;
        result = result.filter(function(item) {
          return item.upbjj === daerah;
        });
      }

      // Filter Kategori (Dependent - hanya aktif jika daerah dipilih)
      if (this.filterKategori) {
        var kategori = this.filterKategori;
        result = result.filter(function(item) {
          return item.kategori === kategori;
        });
      }

      // Filter Status Kritis
      if (this.filterStatus === 'kritis') {
        result = result.filter(function(item) {
          return item.qty < item.safety || item.qty === 0;
        });
      }

      // Sort
      if (this.sortBy === 'judul') {
        result = result.slice().sort(function(a, b) {
          return a.judul.localeCompare(b.judul);
        });
      } else if (this.sortBy === 'qty') {
        result = result.slice().sort(function(a, b) {
          return a.qty - b.qty;
        });
      } else if (this.sortBy === 'harga') {
        result = result.slice().sort(function(a, b) {
          return a.harga - b.harga;
        });
      }

      return result;
    },

    // Computed property: total SKU terfilter
    totalSKU: function() {
      return this.filteredStok.length;
    }
  },

  watch: {
    // Watcher 1: Reset kategori jika filter daerah berubah (dependent dropdown)
    filterDaerah: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.filterKategori = '';
      }
    }
  },

  methods: {
    // Method: reset semua filter
    resetFilter: function() {
      this.filterDaerah = '';
      this.filterKategori = '';
      this.filterStatus = '';
      this.sortBy = '';
    },

    // Method: emit event edit ke parent (mouse click handler)
    editItem: function(item) {
      this.$emit('edit-item', item);
    },

    // Method: menghapus item dengan konfirmasi pop-up
    deleteItem: function(item) {
      if (confirm('Apakah Anda yakin ingin menghapus bahan ajar ' + item.kode + ' (' + item.judul + ')?')) {
        this.$emit('delete-item', item);
      }
    }
  },

  // Template: tabel lengkap dengan filter section
  template: '\
    <div>\
      <div class="stats-container">\
        <stat-card-component\
          title="Total SKU Terfilter"\
          :value="totalSKU"\
          :show-trend="true"\
        ></stat-card-component>\
      </div>\
      \
      <div class="filter-section">\
        <div class="form-group">\
          <label for="filterDaerah">UT-Daerah</label>\
          <select id="filterDaerah" class="form-control" v-model="filterDaerah">\
            <option value="">Semua Daerah</option>\
            <option v-for="daerah in upbjjList" :value="daerah" :key="daerah">{{ daerah }}</option>\
          </select>\
        </div>\
        \
        <div class="form-group" v-show="filterDaerah !== \'\'">\
          <label for="filterKategori">Kategori</label>\
          <select id="filterKategori" class="form-control" v-model="filterKategori">\
            <option value="">Semua Kategori</option>\
            <option v-for="kat in kategoriList" :value="kat" :key="kat">{{ kat }}</option>\
          </select>\
        </div>\
        \
        <div class="form-group">\
          <label for="filterStatus">Peringatan Stok</label>\
          <select id="filterStatus" class="form-control" v-model="filterStatus">\
            <option value="">Semua Status</option>\
            <option value="kritis">Hanya Qty &lt; Safety / Kosong</option>\
          </select>\
        </div>\
        \
        <div class="form-group">\
          <label for="sortBy">Urutkan</label>\
          <select id="sortBy" class="form-control" v-model="sortBy">\
            <option value="">Default</option>\
            <option value="judul">Judul (A-Z)</option>\
            <option value="qty">Stok (Terendah)</option>\
            <option value="harga">Harga (Termurah)</option>\
          </select>\
        </div>\
        \
        <div class="form-group" style="justify-content: flex-end;">\
          <button class="btn btn-outline" @click="resetFilter" style="height: 38px;">\
            <i class="ph ph-arrow-counter-clockwise"></i> Reset\
          </button>\
        </div>\
      </div>\
      \
      <div class="table-card">\
        <table class="table">\
          <thead>\
            <tr>\
              <th>Kode</th>\
              <th>Judul / Nama Mata Kuliah</th>\
              <th>Kategori</th>\
              <th>Lokasi</th>\
              <th>Harga</th>\
              <th>Jumlah (Qty)</th>\
              <th>Status</th>\
              <th>Aksi</th>\
            </tr>\
          </thead>\
          <tbody>\
            <tr v-for="(item, index) in filteredStok" :key="item.kode">\
              <td><strong>{{ item.kode }}</strong></td>\
              <td v-text="item.judul"></td>\
              <td>{{ item.kategori | capitalize }}</td>\
              <td>{{ item.upbjj }}<br><small style="color:var(--text-muted)">{{ item.lokasiRak }}</small></td>\
              <td style="font-weight: 500;">{{ item.harga | rupiah }}</td>\
              <td>\
                <span style="font-weight: 600;">{{ item.qty }} (buah)</span>\
                <span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-top: 2px;">Saf: {{ item.safety }} (buah)</span>\
              </td>\
              <td class="tooltip-container" :title="item.catatanHTML ? item.catatanHTML.replace(/<[^>]*>?/gm, \'\') : \'Tidak ada catatan\'" style="cursor: help;">\
                <span v-if="item.qty === 0" class="badge badge-kritis">Kosong</span>\
                <span v-else-if="item.qty < item.safety" class="badge badge-menipis">Menipis</span>\
                <span v-else class="badge badge-aman">Aman</span>\
              </td>\
              <td>\
                <div style="display: flex; gap: 8px;">\
                  <button class="btn btn-outline" style="padding: 6px 10px;" @click="editItem(item)">\
                    <i class="ph ph-pencil-simple"></i> Edit\
                  </button>\
                  <button class="btn btn-outline" style="padding: 6px 10px; color: var(--status-kritis-text);" @click="deleteItem(item)">\
                    <i class="ph ph-trash"></i> Delete\
                  </button>\
                </div>\
              </td>\
            </tr>\
            <tr v-if="filteredStok.length === 0">\
              <td colspan="8" style="text-align: center; padding: 32px; color: var(--text-muted);">\
                Data tidak ditemukan.\
              </td>\
            </tr>\
          </tbody>\
        </table>\
      </div>\
    </div>\
  '
});
