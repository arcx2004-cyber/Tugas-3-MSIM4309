/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

// ============================================
// Vue Component: Sidebar Navigation
// Komponen ini menangani navigasi sidebar
// dengan menu items yang dinamis menggunakan
// v-for dan v-bind untuk class active.
// ============================================

Vue.component('sidebar-component', {
  // Props: menerima data dari parent
  props: {
    activePage: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      // Data array menu navigasi untuk v-for rendering
      menuItems: [
        { label: 'Dashboard', icon: 'ph ph-squares-four', href: 'index.html', page: 'dashboard' },
        { label: 'Manajemen Stok', icon: 'ph ph-warehouse', href: 'stok.html', page: 'stok' },
        { label: 'Tracking DO', icon: 'ph ph-map-pin-line', href: 'tracking.html', page: 'tracking' },
        { label: 'Pemesanan', icon: 'ph ph-shopping-cart', href: 'pemesanan.html', page: 'pemesanan' }
      ]
    };
  },
  // Template: menggunakan Vue template string
  template: '\
    <aside class="sidebar">\
      <div class="sidebar-header">\
        <img src="assets/Logo_Universitas_Terbuka.svg" alt="Logo UT" style="width: 32px; height: auto;">\
        <span style="font-size: 1.1rem;">Universitas Terbuka</span>\
      </div>\
      <ul class="sidebar-nav">\
        <li v-for="item in menuItems" :key="item.page">\
          <a :href="item.href" :class="{ active: activePage === item.page }">\
            <i :class="item.icon"></i> {{ item.label }}\
          </a>\
        </li>\
      </ul>\
      <div class="sidebar-footer">\
        <img src="assets/user.jpeg" alt="User Avatar" class="avatar" style="object-fit: cover;">\
        <div>\
          <div style="font-weight: 600; font-size: 0.9rem;">Admin UT</div>\
          <div style="font-size: 0.75rem; opacity: 0.7;">Administrator</div>\
        </div>\
      </div>\
    </aside>\
  '
});
