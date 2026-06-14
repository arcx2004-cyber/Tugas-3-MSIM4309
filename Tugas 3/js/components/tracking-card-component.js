/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

// ============================================
// Vue Component: Tracking Card (Kartu Tracking DO)
// Komponen ini menampilkan kartu detail setiap
// Delivery Order (DO) dengan timeline tracking.
// Menggunakan: v-for (list rendering), v-bind,
// props, filter rupiah & capitalize.
// ============================================

Vue.component('tracking-card-component', {
  // Props: menerima data DO dari parent
  props: {
    doItem: {
      type: Object,
      required: true
    }
  },
  methods: {
    // Method: format Rupiah (juga tersedia sebagai filter global)
    formatRupiah: function(angka) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
    }
  },
  // Template: kartu tracking dengan timeline
  template: '\
    <div class="table-card" style="padding: 24px;">\
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px;">\
        <div>\
          <h3 style="font-size: 1.15rem; margin-bottom: 4px;">\
            <i class="ph ph-truck" style="margin-right: 8px;"></i>{{ doItem.nomorDO }}\
          </h3>\
          <div style="font-size: 0.85rem; color: var(--text-muted);">\
            Penerima: {{ doItem.nama | capitalize }} ({{ doItem.nim }}) | Tgl Kirim: {{ doItem.tanggalKirim }}\
          </div>\
        </div>\
        <div style="display: flex; gap: 12px; align-items: center;">\
          <span class="badge badge-menipis">{{ doItem.status | capitalize }}</span>\
          <button class="btn btn-primary" style="padding: 4px 10px; font-size: 0.8rem;" @click="$emit(\'add-progress\', doItem)">\
            <i class="ph ph-plus"></i> Progress\
          </button>\
        </div>\
      </div>\
      \
      <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 16px;">\
        <div><strong>Paket:</strong> {{ doItem.paket }}</div>\
        <div><strong>Ekspedisi:</strong> {{ doItem.ekspedisi }}</div>\
        <div style="color: var(--primary-color); font-weight: 700;">{{ doItem.total | rupiah }}</div>\
      </div>\
      \
      <div class="timeline">\
        <div class="timeline-item" v-for="(log, idx) in doItem.timeline" :key="idx">\
          <div class="timeline-time">{{ log.waktu }}</div>\
          <div class="timeline-desc">{{ log.keterangan }}</div>\
        </div>\
      </div>\
    </div>\
  '
});
