/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

// ============================================
// Vue Component: Stok Modal (Form Tambah/Edit Stok)
// Komponen ini menangani form modal untuk
// menambah atau mengedit data stok.
// Menggunakan: v-model (two-way data binding),
// v-if, v-for, :disabled (v-bind), $emit,
// watcher untuk validasi, form validation,
// dan event handler keyboard (@keyup.escape).
// ============================================

Vue.component('stok-modal-component', {
  // Props: menerima state dan data dari parent
  props: {
    show: {
      type: Boolean,
      default: false
    },
    editMode: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: function() {
        return {
          kode: '', judul: '', kategori: '', upbjj: '',
          lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: ''
        };
      }
    },
    kategoriList: {
      type: Array,
      required: true
    },
    upbjjList: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      // Clone form data agar tidak langsung mengubah prop
      form: Object.assign({}, this.formData)
    };
  },

  watch: {
    // Watcher 1: sinkronisasi formData prop ke local form saat prop berubah
    formData: {
      handler: function(newVal) {
        this.form = Object.assign({}, newVal);
      },
      deep: true
    },
    // Watcher 2: validasi Qty tidak boleh negatif
    'form.qty': function(newVal) {
      if (newVal < 0) {
        this.form.qty = 0;
      }
    },
    // Watcher 3: validasi Safety stok tidak boleh negatif
    'form.safety': function(newVal) {
      if (newVal < 0) {
        this.form.safety = 0;
      }
    }
  },

  methods: {
    // Method: simpan data dan emit ke parent
    save: function() {
      // Validasi sederhana
      if (!this.form.kode || !this.form.judul) {
        alert('Kode dan Judul tidak boleh kosong!');
        return;
      }
      this.$emit('save', Object.assign({}, this.form));
    },
    // Method: tutup modal dan emit event ke parent
    close: function() {
      this.$emit('close');
    },
    // Method: handle keyboard event Escape untuk menutup modal
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

  // Template: form modal untuk tambah/edit stok
  template: '\
    <div class="modal-overlay" v-if="show">\
      <div class="modal-content">\
        <div class="modal-header">\
          <h3>{{ editMode ? "Edit Stok" : "Tambah Stok Baru" }}</h3>\
          <button class="close-btn" @click="close">&times;</button>\
        </div>\
        <div class="modal-body">\
          <div class="form-group">\
            <label>Kode Mata Kuliah</label>\
            <input type="text" class="form-control" v-model="form.kode" :disabled="editMode"\
                   @keyup.enter="save">\
          </div>\
          <div class="form-group">\
            <label>Judul / Nama Mata Kuliah</label>\
            <input type="text" class="form-control" v-model="form.judul"\
                   @keyup.enter="save">\
          </div>\
          <div style="display: flex; gap: 16px;">\
            <div class="form-group" style="flex: 1;">\
              <label>Kategori</label>\
              <select class="form-control" v-model="form.kategori">\
                <option v-for="kat in kategoriList" :value="kat">{{ kat | capitalize }}</option>\
              </select>\
            </div>\
            <div class="form-group" style="flex: 1;">\
              <label>UT-Daerah</label>\
              <select class="form-control" v-model="form.upbjj">\
                <option v-for="daerah in upbjjList" :value="daerah">{{ daerah }}</option>\
              </select>\
            </div>\
          </div>\
          <div style="display: flex; gap: 16px;">\
            <div class="form-group" style="flex: 1;">\
              <label>Lokasi Rak</label>\
              <input type="text" class="form-control" v-model="form.lokasiRak">\
            </div>\
            <div class="form-group" style="flex: 1;">\
              <label>Harga (Rp)</label>\
              <input type="number" class="form-control" v-model.number="form.harga">\
            </div>\
          </div>\
          <div style="display: flex; gap: 16px;">\
            <div class="form-group" style="flex: 1;">\
              <label>Qty (Stok)</label>\
              <input type="number" class="form-control" v-model.number="form.qty" min="0">\
            </div>\
            <div class="form-group" style="flex: 1;">\
              <label>Safety Stok</label>\
              <input type="number" class="form-control" v-model.number="form.safety" min="0">\
            </div>\
          </div>\
          <div class="form-group">\
            <label>Catatan (Dukung Tag HTML)</label>\
            <input type="text" class="form-control" v-model="form.catatanHTML"\
                   placeholder="Contoh: <strong>Penting</strong>"\
                   @keyup.enter="save">\
          </div>\
        </div>\
        <div class="modal-footer">\
          <button class="btn btn-outline" @click="close">Batal</button>\
          <button class="btn btn-primary" @click="save">Simpan</button>\
        </div>\
      </div>\
    </div>\
  '
});
