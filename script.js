// url api data umkm
const url_umkm = "https://data.jabarprov.go.id/api-backend/bigdata/diskuk/od_17371_proyeksi_jml_ush_mikro_kecil_menengah_umkm__kabupatenk";
// url api data transportasi
const url_transportasi = "https://data.jabarprov.go.id/api-backend/bigdata/dishub/od_19871_jml_moda_transportasi_angkutan_kota_dalam_prov__kabupa";
// url api data wisatawan
const url_wisatawan = "https://data.jabarprov.go.id/api-backend/bigdata/disparbud/od_15367_jml_pengunjung_ke_objek_wisata__jenis_wisatawan_kabupa";
// url api data kriminalitas
// const url_kriminal = "https://data.jabarprov.go.id/api-backend/bigdata/dpmdes/idm_dftr_sts_partisipasi_warga_dalam_sistem_aman_lingkungan__de";
// url api data penduduk
const url_penduduk = "https://data.jabarprov.go.id/api-backend/bigdata/disdukcapil-2/od_15921_jml_penduduk__jk_desakelurahan";
// url api data daerah
const url_daerah = "https://data.jabarprov.go.id/api-backend/bigdata/diskominfo/od_kode_wilayah_dan_nama_wilayah_kota_kabupaten";

// mengambil data transportasi dari api
async function get_transportation(tahun = 2022) {
  const response = await fetch(`${url_transportasi}?where={'tahun':'${tahun}'}`);
  const data = await response.json();
  const data_transportasi = data.data;
  return data_transportasi;
}

// mengambil data umkm dari api
async function get_umkm(tahun = 2021, kategori = "FASHION") {
  const response = await fetch(`${url_umkm}?where={'tahun': '${tahun}', 'kategori_usaha': '${kategori}'}`);
  const data = await response.json();
  const data_umkm = data.data;
  return data_umkm;
}

// mengambil data wisatawan dari api
async function get_wisatawan(tahun = 2022) {
  const response = await fetch(`${url_wisatawan}?where={'tahun':'${tahun}'}`);
  const data = await response.json();
  const data_wisatawan = data.data;
  return data_wisatawan;
}

// mengambil data kriminalitas dari api
// async function get_kriminal() {
//   const response = await fetch(`${url_kriminal}?where={'tahun':'2021'}&limit=100`);
//   const data = await response.json();
//   const data_kriminal = data.data;
//   return data_kriminal;
// }

// mengambil data penduduk dari api
async function get_penduduk(tahun = 2020) {
  const response = await fetch(`${url_penduduk}?where={'tahun':${tahun}}&limit=25000`);
  const data = await response.json();
  const data_penduduk = data.data;
  return data_penduduk;
}

// mengambil data daerah dari api
async function get_daerah() {
  const response = await fetch(`${url_daerah}`);
  const data = await response.json();
  const data_daerah = data.data;
  return data_daerah;
}

// mengambil data daerah dari api berdasarkan daerah
async function get_total_penduduk() {
  const [penduduk, daerah] = await Promise.all([get_penduduk(), get_daerah()]);

  let data_penduduk = [];
  for (let i = 0; i < daerah.length - 1; i++) {
    let total = 0;
    for (let j = 0; j < penduduk.length; j++) {
      if (penduduk[j].bps_kode_kabupaten_kota === daerah[i].bps_kota_kode) {
        total += parseInt(penduduk[j].jumlah_penduduk);
      }
    }
    data_penduduk.push({
      kota_kode: daerah[i].bps_kota_kode,
      kota_nama: daerah[i].bps_kota_nama,

      jumlah_penduduk: total,
    });
  }

  return data_penduduk;
}

// mengambil total wisatawan dari api berdasarkan daerah
async function get_total_wisatawan() {
  const [wisatawan, daerah] = await Promise.all([get_wisatawan(), get_daerah()]);

  let data_wisatawan = [];
  for (let i = 0; i < daerah.length - 1; i++) {
    let total = 0;
    for (let j = 0; j < wisatawan.length; j++) {
      if (wisatawan[j].kode_kabupaten_kota === daerah[i].bps_kota_kode) {
        total += parseInt(wisatawan[j].jumlah_pengunjung);
      }
    }
    data_wisatawan.push({
      kota_kode: daerah[i].bps_kota_kode,
      kota_nama: daerah[i].bps_kota_nama,

      jumlah_pengunjung: total,
    });
  }

  return data_wisatawan;
}

// mengambil total umkm dari api berdasarkan daerah
async function get_total_umkm() {
  const [umkm, daerah] = await Promise.all([get_umkm(), get_daerah()]);

  let data_umkm = [];
  for (let i = 0; i < daerah.length - 1; i++) {
    let total = 0;
    for (let j = 0; j < umkm.length; j++) {
      if (umkm[j].kode_kabupaten_kota === daerah[i].bps_kota_kode) {
        total += parseInt(umkm[j].proyeksi_jumlah_umkm);
      }
    }
    data_umkm.push({
      kota_kode: daerah[i].bps_kota_kode,
      kota_nama: daerah[i].bps_kota_nama,

      proyeksi_jumlah_umkm: total,
    });
  }

  return data_umkm;
}

// mengambil total transportasi dari api berdasarkan daerah
async function get_total_transportasi() {
  const [transportasi, daerah] = await Promise.all([get_transportation(), get_daerah()]);

  let data_transportasi = [];
  for (let i = 0; i < daerah.length - 1; i++) {
    let total = 0;
    for (let j = 0; j < transportasi.length; j++) {
      if (transportasi[j].kode_kabupaten === daerah[i].bps_kota_kode) {
        total += parseInt(transportasi[j].jumlah_moda_tranportasi_akdp);
      }
    }
    data_transportasi.push({
      kota_kode: daerah[i].bps_kota_kode,
      kota_nama: daerah[i].bps_kota_nama,

      jumlah_moda_tranportasi_akdp: total,
    });
  }

  return data_transportasi;
}

// mencari matrix pembagi
function matrix_pembagi(data) {
  pembagi = [];
  for (let i = 0; i < data[0].data.length; i++) {
    nominal = 0;
    for (let j = 0; j < data.length; j++) {
      nominal += Math.pow(data[j].data[i], 2);
    }
    pembagi.push(Math.sqrt(nominal));
  }

  return pembagi;
}

// menormalisasikan matrix
function matrix_normalisasi(data, pembagi) {
  normalisasi = [];
  for (let i = 0; i < data.length; i++) {
    normalisasi.push([]);
    for (let j = 0; j < data[i].data.length; j++) {
      normalisasi[i].push(data[i].data[j] / pembagi[j]);
    }
  }
  return normalisasi;
}

// mencari matrix bobot
function matrix_bobot(normalisasi, bobot) {
  let datas = [];
  for (let i = 0; i < normalisasi.length; i++) {
    let x = [];
    for (let j = 0; j < normalisasi[i].length; j++) {
      x.push(normalisasi[i][j] * bobot[j]);
    }
    datas.push(x);
  }
  return datas;
}

// mencari ideal positif
function ideal_positif(matrix_bobot, status) {
  let datas = [];
  for (let i = 0; i < matrix_bobot[0].length; i++) {
    if (status[i] == "cost") {
      datas.push(Math.min(...matrix_bobot.map((item) => item[i])));
    } else {
      datas.push(Math.max(...matrix_bobot.map((item) => item[i])));
    }
  }
  return datas;
}

// mencari ideal negatif
function ideal_negatif(matrix_bobot, status) {
  let datas = [];
  for (let i = 0; i < matrix_bobot[0].length; i++) {
    if (status[i] == "cost") {
      datas.push(Math.max(...matrix_bobot.map((item) => item[i])));
    } else {
      datas.push(Math.min(...matrix_bobot.map((item) => item[i])));
    }
  }
  return datas;
}

// mencari d+
function d_plus(matrix_bobot, ideal_positif) {
  let datas = [];
  for (let i = 0; i < matrix_bobot.length; i++) {
    nominal = 0;
    for (let j = 0; j < matrix_bobot[i].length; j++) {
      nominal += Math.pow(matrix_bobot[i][j] - ideal_positif[j], 2);
    }
    datas.push(Math.sqrt(nominal));
  }
  return datas;
}

// mencari d-
function d_min(matrix_bobot, ideal_negatif) {
  let datas = [];
  for (let i = 0; i < matrix_bobot.length; i++) {
    nominal = 0;
    for (let j = 0; j < matrix_bobot[i].length; j++) {
      nominal += Math.pow(matrix_bobot[i][j] - ideal_negatif[j], 2);
    }
    datas.push(Math.sqrt(nominal));
  }
  return datas;
}

// mencari preferensi
function preferensi(d_plus, d_min) {
  let datas = [];
  for (let i = 0; i < d_plus.length; i++) {
    datas.push(d_min[i] / (d_min[i] + d_plus[i]));
  }
  return datas;
}

// mencari ranking
function ranking(preferensi, data) {
  let before = [];
  for (let i = 0; i < data.length; i++) {
    before.push({
      kota_kode: data[i].kota_kode,
      kota_nama: data[i].kota_nama,
      prefrensi: preferensi[i],
      data: data[i].data,
    });
  }

  before.sort((a, b) => b.prefrensi - a.prefrensi);
  // datas.reverse();

  for (let i = 0; i < before.length; i++) {
    before[i].rank = i + 1;
  }

  return before;
}

// filtering data berdasarkan kota yang dipilih
function filter() {
  let inputKota = document.querySelectorAll('input[name="kota"]');
  let selectedKota = [];
  for (let i = 0; i < inputKota.length; i++) {
    if (inputKota[i].checked) {
      let value = parseInt(inputKota[i].value);
      selectedKota.push(value);
    }
  }

  return selectedKota;
}

// mengambil nilai dataset dari data data yang sudah di filter
async function dataset() {
  const [umkm, wisatawan, transportasi, penduduk, daerah] = await Promise.all([get_total_umkm(), get_total_wisatawan(), get_total_transportasi(), get_total_penduduk(), get_daerah()]);

  let data = [];

  for (let i = 0; i < daerah.length; i++) {
    if (filter().includes(daerah[i].bps_kota_kode)) {
      data.push({
        kota_kode: daerah[i].bps_kota_kode,
        kota_nama: daerah[i].bps_kota_nama,
        // data: [wisatawan[i].jumlah_pengunjung, umkm[i].proyeksi_jumlah_umkm, transportasi[i].jumlah_moda_tranportasi_akdp, penduduk[i].jumlah_penduduk],
        data: [umkm[i].proyeksi_jumlah_umkm, transportasi[i].jumlah_moda_tranportasi_akdp, wisatawan[i].jumlah_pengunjung, penduduk[i].jumlah_penduduk],
      });
    }
  }

  return data;
}

// mengambil nilai bobot dari inputan
function getBobot() {
  const umkm = document.getElementById("umkm").value;
  const transportasi = document.getElementById("transportasi").value;
  const wisatawan = document.getElementById("wisatawan").value;
  const penduduk = document.getElementById("penduduk").value;

  return [parseInt(umkm), parseInt(transportasi), parseInt(wisatawan), parseInt(penduduk)];
}

// menghitung menggunakan metode topsis
async function topsis() {
  const data = await dataset();
  let bobot = getBobot();
  let status = ["cost", "benefit", "benefit", "benefit"];

  const pembagi = matrix_pembagi(data);
  // return pembagi;
  const normalisasi = matrix_normalisasi(data, pembagi);
  // return normalisasi;
  const bobot_x = matrix_bobot(normalisasi, bobot);
  // return bobot_x;
  const ideal_positif_x = ideal_positif(bobot_x, status);
  // return ideal_positif_x;
  const ideal_negatif_x = ideal_negatif(bobot_x, status);
  // return ideal_negatif_x;
  const d_plus_x = d_plus(bobot_x, ideal_positif_x);
  // return d_plus_x;
  const d_min_x = d_min(bobot_x, ideal_negatif_x);
  // return d_min_x;
  const preferensi_x = preferensi(d_plus_x, d_min_x);
  // return preferensi_x;
  const ranking_x = ranking(preferensi_x, data);

  return ranking_x;
}
