/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

// ============================================
// Vue Component: Pemesanan Card
// Komponen ini menampilkan kartu detail setiap
// pemesanan bahan ajar mahasiswa.
// Menggunakan: v-for, v-if/v-else-if/v-else,
// v-bind, props, computed, methods,
// filter (rupiah, capitalize), dan $emit.
// ============================================

Vue.component('pemesanan-card-component', {
  // Props: menerima data pemesanan dari parent
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  computed: {
    // Computed property: menentukan class badge berdasarkan status
    badgeClass: function() {
      switch (this.order.status) {
        case 'Pending': return 'badge badge-menipis';
        case 'Diproses': return 'badge badge-aman';
        case 'Ditolak': return 'badge badge-kritis';
        case 'Selesai': return 'badge badge-aman';
        default: return 'badge badge-menipis';
      }
    },
    // Computed property: hitung jumlah item dalam pesanan
    totalItems: function() {
      return this.order.items.length;
    }
  },
  methods: {
    // Method: emit event proses pesanan ke parent (mouse click handler)
    prosesPesanan: function() {
      this.$emit('proses', this.order);
    },
    // Method: emit event tolak pesanan ke parent
    tolakPesanan: function() {
      this.$emit('tolak', this.order);
    },
    // Method: format Rupiah
    formatRupiah: function(angka) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
    }
  },
  // Template: kartu pemesanan dengan detail dan aksi
  template: '\
    <div class="table-card" style="padding: 24px; margin-bottom: 16px;">\
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px;">\
        <div>\
          <h3 style="font-size: 1.15rem; margin-bottom: 4px;">\
            <i class="ph ph-receipt" style="margin-right: 8px;"></i>{{ order.noPemesanan }}\
          </h3>\
          <div style="font-size: 0.85rem; color: var(--text-muted);">\
            {{ order.nama | capitalize }} ({{ order.nim }}) | Tanggal: {{ order.tanggal }}\
          </div>\
        </div>\
        <span :class="badgeClass">{{ order.status | capitalize }}</span>\
      </div>\
      \
      <div style="margin-bottom: 16px;">\
        <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-bottom: 8px;">DETAIL PESANAN</div>\
        <table class="table" style="font-size: 0.9rem;">\
          <thead>\
            <tr>\
              <th>Kode</th>\
              <th>Judul Bahan Ajar</th>\
              <th>Qty</th>\
              <th>Harga</th>\
              <th>Subtotal</th>\
            </tr>\
          </thead>\
          <tbody>\
            <tr v-for="(item, idx) in order.items" :key="idx">\
              <td><strong>{{ item.kode }}</strong></td>\
              <td v-text="item.judul"></td>\
              <td>{{ item.qty }}</td>\
              <td>{{ item.harga | rupiah }}</td>\
              <td style="font-weight: 600;">{{ (item.qty * item.harga) | rupiah }}</td>\
            </tr>\
          </tbody>\
        </table>\
      </div>\
      \
      <div style="display: flex; justify-content: space-between; align-items: center;">\
        <div>\
          <span style="font-size: 0.85rem; color: var(--text-muted);">Alamat: </span>\
          <span style="font-size: 0.9rem;">{{ order.alamat | truncate(50) }}</span>\
        </div>\
        <div style="display: flex; align-items: center; gap: 16px;">\
          <div style="font-weight: 700; color: var(--primary-color); font-size: 1.1rem;">{{ order.totalHarga | rupiah }}</div>\
          <div v-if="order.status === \'Pending\'" style="display: flex; gap: 8px;">\
            <button class="btn btn-primary" style="padding: 6px 14px;" @click="prosesPesanan">\
              <i class="ph ph-check"></i> Proses\
            </button>\
            <button class="btn btn-outline" style="padding: 6px 14px; color: var(--status-kritis-text);" @click="tolakPesanan">\
              <i class="ph ph-x"></i> Tolak\
            </button>\
          </div>\
          <div v-else-if="order.status === \'Diproses\'">\
            <span style="font-size: 0.85rem; color: var(--status-aman-text); font-weight: 600;">\
              <i class="ph ph-spinner"></i> Sedang Diproses\
            </span>\
          </div>\
          <div v-else-if="order.status === \'Ditolak\'">\
            <span style="font-size: 0.85rem; color: var(--status-kritis-text); font-weight: 600;">\
              <i class="ph ph-prohibit"></i> Pesanan Ditolak\
            </span>\
          </div>\
          <div v-else>\
            <span style="font-size: 0.85rem; color: var(--status-aman-text); font-weight: 600;">\
              <i class="ph ph-check-circle"></i> Selesai\
            </span>\
          </div>\
        </div>\
      </div>\
    </div>\
  '
});
