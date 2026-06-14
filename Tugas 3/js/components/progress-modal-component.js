/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

// ============================================
// Vue Component: Progress Modal
// Komponen form untuk menambah status progress
// pengiriman pada Tracking DO tertentu.
// ============================================

Vue.component('progress-modal-component', {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    doItem: {
      type: Object,
      default: null
    }
  },
  data: function() {
    return {
      formData: {
        keterangan: ''
      },
      errors: {}
    };
  },
  methods: {
    closeModal: function() {
      this.formData.keterangan = '';
      this.errors = {};
      this.$emit('close');
    },
    saveData: function() {
      this.errors = {};
      if (!this.formData.keterangan.trim()) {
        this.$set(this.errors, 'keterangan', 'Keterangan progress wajib diisi');
        return;
      }

      // Ambil waktu dari Date()
      var d = new Date();
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
      var waktu = d.getDate().toString().padStart(2, '0') + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ' ' + d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');

      var newProgress = {
        waktu: waktu,
        keterangan: this.formData.keterangan,
        status: 'success'
      };

      this.$emit('save', {
        nomorDO: this.doItem.nomorDO,
        progress: newProgress
      });
      
      this.closeModal();
    }
  },
  template: '\
    <div v-if="show" class="modal-overlay" @click.self="closeModal" @keyup.esc="closeModal" tabindex="0">\
      <div class="modal-content" style="max-width: 450px;">\
        <div class="modal-header">\
          <h2>Tambah Progress Pengiriman</h2>\
          <button class="close-btn" @click="closeModal"><i class="ph ph-x"></i></button>\
        </div>\
        \
        <div class="modal-body" v-if="doItem">\
          <div style="margin-bottom: 16px; padding: 12px; background: var(--bg-main); border-radius: 6px;">\
            <div style="font-size: 0.8rem; color: var(--text-muted);">Nomor DO</div>\
            <div style="font-weight: 600;">{{ doItem.nomorDO }}</div>\
          </div>\
          <div class="form-group">\
            <label>Keterangan Progress</label>\
            <input type="text" class="form-control" v-model="formData.keterangan" @keyup.enter="saveData" placeholder="Contoh: Paket telah tiba di gudang sortir kota tujuan">\
            <div v-if="errors.keterangan" class="error-message" style="color: var(--status-kritis-text); font-size: 0.8rem; margin-top: 4px;">{{ errors.keterangan }}</div>\
          </div>\
        </div>\
        \
        <div class="modal-footer">\
          <button class="btn btn-outline" @click="closeModal">Batal</button>\
          <button class="btn btn-primary" @click="saveData">Simpan Progress</button>\
        </div>\
      </div>\
    </div>\
  '
});
