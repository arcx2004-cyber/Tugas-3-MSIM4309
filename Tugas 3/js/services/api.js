/*Identitas Mahasiswa
Nama	: Agus Sutikno
NIM	: 052784116
Prodi	: Sistem Informasi
UPBJJ	: UT UPBJJ Jayapura
Tugas	: Tugas Praktikum Mata Kuliah Pemrograman Berbasis Web
*/

// ============================================
// Service: API Data Service
// Bertugas membaca file dataBahanAjar.json
// menggunakan API Fetch untuk disimulasikan
// sebagai endpoint database.
// ============================================

window.apiService = {
  // Fungsi fetch data utama
  fetchData: function() {
    // Menggunakan fetch untuk meload file json
    return fetch('data/dataBahanAjar.json')
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Gagal memuat data JSON');
        }
        return response.json();
      })
      .then(function(data) {
        // Melakukan sedikit transformasi data tracking agar sesuai 
        // dengan format Array of Objects yang digunakan komponen kita
        if (data.tracking) {
          var mappedTracking = data.tracking.map(function(item) {
            var nomorDO = Object.keys(item)[0];
            var doData = item[nomorDO];
            
            // Konversi nama field 'perjalanan' menjadi 'timeline'
            // agar kompatibel dengan tracking-card-component
            var timeline = [];
            if (doData.perjalanan) {
              timeline = doData.perjalanan.map(function(p) {
                return { waktu: p.waktu, keterangan: p.keterangan };
              });
            }

            return {
              nomorDO: nomorDO,
              nim: doData.nim,
              nama: doData.nama,
              status: doData.status,
              ekspedisi: doData.ekspedisi,
              tanggalKirim: doData.tanggalKirim,
              paket: doData.paket,
              total: doData.total,
              timeline: timeline
            };
          });
          data.trackingTransformed = mappedTracking;
        }
        return data;
      })
      .catch(function(error) {
        console.error('Error fetching data:', error);
        return null;
      });
  }
};
