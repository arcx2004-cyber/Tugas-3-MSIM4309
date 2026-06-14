/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

// ============================================
// Vue Component: Pengumuman Modal
// Komponen form modal untuk menambahkan
// pengumuman baru ke Papan Pengumuman.
// Menggunakan v-if, v-model, method, event
// modifier, form validation, dan $emit.
// ============================================

Vue.component('pengumuman-modal-component', {
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data: function() {
    return {
      formData: {
        judul: '',
        isi: '',
        prioritas: 'umum'
      },
      errors: {}
    };
  },
  methods: {
    // Method: Tutup modal dan reset form
    closeModal: function() {
      this.resetForm();
      this.$emit('close');
    },
    // Method: Validasi form sebelum simpan
    validateForm: function() {
      this.errors = {};
      var isValid = true;

      if (!this.formData.judul.trim()) {
        this.$set(this.errors, 'judul', 'Judul wajib diisi');
        isValid = false;
      }
      if (!this.formData.isi.trim()) {
        this.$set(this.errors, 'isi', 'Isi pengumuman wajib diisi');
        isValid = false;
      }
      
      return isValid;
    },
    // Method: Simpan data ke parent
    saveData: function() {
      if (this.validateForm()) {
        // Generate tanggal hari ini (format sederhana: DD Mmm YYYY)
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        var d = new Date();
        var dateStr = d.getDate().toString().padStart(2, '0') + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
        
        // Buat objek pengumuman baru
        var newInfo = {
          judul: this.formData.judul,
          isi: this.formData.isi,
          prioritas: this.formData.prioritas,
          tanggal: dateStr
        };

        // Emit ke parent
        this.$emit('save', newInfo);
        this.closeModal();
      }
    },
    // Method: Reset state form
    resetForm: function() {
      this.formData = {
        judul: '',
        isi: '',
        prioritas: 'umum'
      };
      this.errors = {};
    }
  },
  template: '\
    <div v-if="show" class="modal-overlay" @click.self="closeModal" @keyup.esc="closeModal" tabindex="0">\
      <div class="modal-content" style="max-width: 500px;">\
        <div class="modal-header">\
          <h2>Tambah Pengumuman Baru</h2>\
          <button class="close-btn" @click="closeModal"><i class="ph ph-x"></i></button>\
        </div>\
        \
        <div class="modal-body">\
          <div class="form-group">\
            <label>Judul Pengumuman</label>\
            <input type="text" class="form-control" v-model="formData.judul" placeholder="Contoh: Jadwal Libur">\
            <div v-if="errors.judul" class="error-message" style="color: var(--status-kritis-text); font-size: 0.8rem; margin-top: 4px;">{{ errors.judul }}</div>\
          </div>\
          \
          <div class="form-group">\
            <label>Tingkat Prioritas</label>\
            <select class="form-control" v-model="formData.prioritas">\
              <option value="umum">Umum (Hijau)</option>\
              <option value="info">Info (Kuning)</option>\
              <option value="penting">Penting (Merah)</option>\
            </select>\
          </div>\
          \
          <div class="form-group">\
            <label>Isi Pengumuman</label>\
            <textarea class="form-control" v-model="formData.isi" rows="4" placeholder="Tuliskan isi pengumuman secara detail..."></textarea>\
            <div v-if="errors.isi" class="error-message" style="color: var(--status-kritis-text); font-size: 0.8rem; margin-top: 4px;">{{ errors.isi }}</div>\
          </div>\
        </div>\
        \
        <div class="modal-footer">\
          <button class="btn btn-outline" @click="closeModal">Batal</button>\
          <button class="btn btn-primary" @click="saveData">Simpan Pengumuman</button>\
        </div>\
      </div>\
    </div>\
  '
});
