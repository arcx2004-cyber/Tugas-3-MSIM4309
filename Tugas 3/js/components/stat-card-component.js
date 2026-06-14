/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

// ============================================
// Vue Component: Stat Card (Kartu Statistik)
// Komponen reusable untuk menampilkan kartu
// statistik. Menggunakan props, v-bind,
// v-if untuk conditional rendering, computed
// property, dan filter untuk formatting.
// ============================================

Vue.component('stat-card-component', {
  // Props: menerima data konfigurasi kartu
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    clickable: {
      type: Boolean,
      default: false
    },
    href: {
      type: String,
      default: ''
    },
    // Prop untuk angka besar di sisi kanan kartu
    bigValue: {
      type: [Number, String],
      default: ''
    },
    valueLabel: {
      type: String,
      default: ''
    },
    showTrend: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // Computed property: menentukan style cursor berdasarkan clickable
    cardStyle: function() {
      return {
        cursor: this.clickable ? 'pointer' : 'default',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      };
    }
  },
  methods: {
    // Method: navigasi saat kartu diklik (mouse event handler)
    handleClick: function() {
      if (this.clickable && this.href) {
        window.location.href = this.href;
      }
    }
  },
  // Template: menggunakan Vue template string
  template: '\
    <div class="stat-card" :style="cardStyle" @click="handleClick">\
      <div>\
        <div class="stat-title">{{ title | uppercase }}</div>\
        <div class="stat-value" style="font-size: 1.5rem;">\
          <i v-if="icon" :class="icon"></i> {{ value }}\
        </div>\
        <p v-if="subtitle" style="color: var(--text-muted); font-size: 0.85rem;">{{ subtitle }}</p>\
        <p v-if="showTrend" style="color: var(--status-aman-text); font-size: 0.85rem;">\
          <i class="ph ph-trend-up"></i> Ter-update\
        </p>\
      </div>\
      <div v-if="valueLabel" style="text-align: center; margin-right: 20px;">\
        <div style="font-size: 3.5rem; font-weight: 700; color: var(--primary-color); line-height: 1;">{{ bigValue }}</div>\
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 8px; font-weight: 600;">{{ valueLabel }}</div>\
      </div>\
    </div>\
  '
});
