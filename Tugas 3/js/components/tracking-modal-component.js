/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

// ============================================
// Vue Component: Tracking Modal (Form Pemesanan DO)
// Komponen ini menangani form modal untuk
// membuat Delivery Order baru.
// Menggunakan: v-model (two-way binding),
// v-for (list rendering array paket & ekspedisi),
// v-show (conditional display), v-html,
// computed property, watcher, form validation,
// $emit, dan event handler keyboard.
// ============================================

Vue.component('tracking-modal-component', {
  // Props: menerima konfigurasi dan data dari parent
  props: {
    show: {
      type: Boolean,
      default: false
    },
    generatedDO: {
      type: String,
      required: true
    },
    paketList: {
      type: Array,
      required: true
    },
    pengirimanList: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      // Form data lokal dengan v-model binding
      form: {
        nim: '',
        nama: '',
        ekspedisi: '',
        paket: '',
        tanggalKirim: ''
      },
      // Data untuk v-html rendering detail paket
      detailPaketHTML: ''
    };
  },

  computed: {
    // Computed property: hitung total harga berdasarkan paket yang dipilih
    selectedTotalHarga: function() {
      if (!this.form.paket) return 0;
      var selected = this.paketList.find(function(p) {
        return p.kode === this.form.paket;
      }.bind(this));
      return selected ? selected.harga : 0;
    }
  },

  watch: {
    // Watcher: saat pilihan paket berubah, update detailPaketHTML menggunakan v-html
    'form.paket': function(newVal) {
      if (!newVal) {
        this.detailPaketHTML = '';
        return;
      }
      var selected = this.paketList.find(function(p) {
        return p.kode === newVal;
      });
      if (selected) {
        this.detailPaketHTML = '<strong>Isi Paket:</strong><ul>' +
          selected.isi.map(function(item) {
            return '<li>' + item + '</li>';
          }).join('') +
          '</ul>';
      }
    },
    // Watcher: reset form saat modal dibuka
    show: function(newVal) {
      if (newVal) {
        this.resetForm();
      }
    }
  },

  methods: {
    // Method: reset form ke default
    resetForm: function() {
      var d = new Date();
      var month = '' + (d.getMonth() + 1);
      var day = '' + d.getDate();
      var year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      this.form = {
        nim: '',
        nama: '',
        ekspedisi: '',
        paket: '',
        tanggalKirim: [year, month, day].join('-')
      };
      this.detailPaketHTML = '';
    },

    // Method: simpan DO baru dan emit ke parent
    saveDO: function() {
      // Validasi input sederhana
      if (!this.form.nim || !this.form.nama || !this.form.ekspedisi || !this.form.paket || !this.form.tanggalKirim) {
        alert('Mohon lengkapi semua field formulir!');
        return;
      }
      this.$emit('save', {
        formData: Object.assign({}, this.form),
        totalHarga: this.selectedTotalHarga
      });
    },

    // Method: tutup modal
    close: function() {
      this.$emit('close');
    },

    // Method: format Rupiah
    formatRupiah: function(angka) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
    },

    // Method: handle keyboard event Escape
    handleKeydown: function(e) {
      if (e.key === 'Escape') {
        this.close();
      }
    }
  },

  mounted: function() {
    // Event handler keyboard: mendengarkan Escape key
    document.addEventListener('keydown', this.handleKeydown);
  },

  beforeDestroy: function() {
    document.removeEventListener('keydown', this.handleKeydown);
  },

  // Template: form modal pemesanan DO
  template: '\
    <div class="modal-overlay" v-if="show">\
      <div class="modal-content" style="max-width: 600px;">\
        <div class="modal-header">\
          <h3>Form Pemesanan Delivery Order Baru</h3>\
          <button class="close-btn" @click="close">&times;</button>\
        </div>\
        <div class="modal-body">\
          <div style="background: var(--bg-main); padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; font-weight: 600; text-align: center; font-size: 1.1rem; color: var(--primary-color);">\
            No. DO: {{ generatedDO }}\
          </div>\
          \
          <div style="display: flex; gap: 16px;">\
            <div class="form-group" style="flex: 1;">\
              <label>NIM Mahasiswa</label>\
              <input type="text" class="form-control" v-model="form.nim"\
                     @keyup.enter="saveDO">\
            </div>\
            <div class="form-group" style="flex: 2;">\
              <label>Nama Mahasiswa</label>\
              <input type="text" class="form-control" v-model="form.nama"\
                     @keyup.enter="saveDO">\
            </div>\
          </div>\
          \
          <div style="display: flex; gap: 16px; margin-top: 16px;">\
            <div class="form-group" style="flex: 1;">\
              <label>Ekspedisi Pengiriman</label>\
              <select class="form-control" v-model="form.ekspedisi">\
                <option value="" disabled>-- Pilih Ekspedisi --</option>\
                <option v-for="eks in pengirimanList" :value="eks.kode" :key="eks.kode">\
                  {{ eks.kode }} - {{ eks.nama }}\
                </option>\
              </select>\
            </div>\
            <div class="form-group" style="flex: 1;">\
              <label>Tanggal Kirim</label>\
              <input type="date" class="form-control" v-model="form.tanggalKirim">\
            </div>\
          </div>\
          \
          <div class="form-group" style="margin-top: 16px;">\
            <label>Paket Bahan Ajar</label>\
            <select class="form-control" v-model="form.paket">\
              <option value="" disabled>-- Pilih Paket --</option>\
              <option v-for="pkt in paketList" :value="pkt.kode" :key="pkt.kode">\
                {{ pkt.kode }} - {{ pkt.nama }}\
              </option>\
            </select>\
          </div>\
          \
          <div v-show="form.paket" style="margin-top: 12px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem;">\
            <div v-html="detailPaketHTML"></div>\
            <div style="margin-top: 8px; font-weight: 700; color: var(--primary-color); border-top: 1px dashed #cbd5e1; padding-top: 8px;">\
              Total Harga: {{ selectedTotalHarga | rupiah }}\
            </div>\
          </div>\
        </div>\
        <div class="modal-footer">\
          <button class="btn btn-outline" @click="close">Batal</button>\
          <button class="btn btn-primary" @click="saveDO">Simpan &amp; Proses DO</button>\
        </div>\
      </div>\
    </div>\
  '
});
