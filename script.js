const url_umkm = "https://data.jabarprov.go.id/api-backend/bigdata/diskuk/od_17371_proyeksi_jml_ush_mikro_kecil_menengah_umkm__kabupatenk";
// DONE
const url_transportasi = "https://data.jabarprov.go.id/api-backend/bigdata/dishub/od_19871_jml_moda_transportasi_angkutan_kota_dalam_prov__kabupa";
// DONE
const url_wisatawan = "https://data.jabarprov.go.id/api-backend/bigdata/disparbud/od_15367_jml_pengunjung_ke_objek_wisata__jenis_wisatawan_kabupa";
// DONE
// const url_kriminal = "https://data.jabarprov.go.id/api-backend/bigdata/dpmdes/idm_dftr_sts_partisipasi_warga_dalam_sistem_aman_lingkungan__de";
// NOT YET
const url_penduduk = "https://data.jabarprov.go.id/api-backend/bigdata/disdukcapil-2/od_15921_jml_penduduk__jk_desakelurahan";
// DONE
const url_daerah = "https://data.jabarprov.go.id/api-backend/bigdata/diskominfo/od_kode_wilayah_dan_nama_wilayah_kota_kabupaten";
// DONE

async function get_transportation(tahun = 2022) {
  const response = await fetch(`${url_transportasi}?where={'tahun':${tahun}}`);
  const data = await response.json();
  const data_transportasi = data.data;
  return data_transportasi;
}

async function get_umkm(tahun = 2021, kategori = "FASHION") {
  const response = await fetch(`${url_umkm}?where={'tahun': '${tahun}', 'kategori_usaha': '${kategori}'}`);
  const data = await response.json();
  const data_umkm = data.data;
  return data_umkm;
}

async function get_wisatawan(tahun = 2022) {
  const response = await fetch(`${url_wisatawan}?where={'tahun':'${tahun}'}`);
  const data = await response.json();
  const data_wisatawan = data.data;
  return data_wisatawan;
}

// async function get_kriminal() {
//   const response = await fetch(`${url_kriminal}?where={'tahun':'2021'}&limit=100`);
//   const data = await response.json();
//   const data_kriminal = data.data;
//   return data_kriminal;
// }

async function get_penduduk(tahun = 2020) {
  const response = await fetch(`${url_penduduk}?where={'tahun':${tahun}}&limit=25000`);
  const data = await response.json();
  const data_penduduk = data.data;
  return data_penduduk;
}

async function get_daerah() {
  const response = await fetch(`${url_daerah}`);
  const data = await response.json();
  const data_daerah = data.data;
  return data_daerah;
}

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

const dummdata = [
  {
    kandidate: "A1",
    kriteria: [4, 4, 5, 4, 4],
  },
  {
    kandidate: "A2",
    kriteria: [5, 4, 4, 4, 4],
  },
  {
    kandidate: "A3",
    kriteria: [2, 2, 3, 3, 3],
  },
  {
    kandidate: "A4",
    kriteria: [2, 3, 2, 2, 2],
  },
  {
    kandidate: "A5",
    kriteria: [2, 2, 2, 1, 1],
  },
  {
    kandidate: "A6",
    kriteria: [1, 4, 4, 3, 3],
  },
];

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

function matrix_bobot(normalisasi, bobot) {
  matrix_bobot = [];
  for (let i = 0; i < normalisasi.length; i++) {
    matrix_bobot.push([]);
    for (let j = 0; j < normalisasi[i].length; j++) {
      matrix_bobot[i].push(normalisasi[i][j] * bobot[j]);
    }
  }
  return matrix_bobot;
}

function ideal_positif(matrix_bobot) {
  ideal_positif = [];
  for (let i = 0; i < matrix_bobot[0].length; i++) {
    ideal_positif.push(Math.max(...matrix_bobot.map((item) => item[i])));
  }
  return ideal_positif;
}

function ideal_negatif(matrix_bobot) {
  ideal_negatif = [];
  for (let i = 0; i < matrix_bobot[0].length; i++) {
    ideal_negatif.push(Math.min(...matrix_bobot.map((item) => item[i])));
  }
  return ideal_negatif;
}

function d_plus(matrix_bobot, ideal_positif) {
  d_plus = [];
  for (let i = 0; i < matrix_bobot.length; i++) {
    nominal = 0;
    for (let j = 0; j < matrix_bobot[i].length; j++) {
      nominal += Math.pow(matrix_bobot[i][j] - ideal_positif[j], 2);
    }
    d_plus.push(Math.sqrt(nominal));
  }
  return d_plus;
}

function d_min(matrix_bobot, ideal_negatif) {
  d_min = [];
  for (let i = 0; i < matrix_bobot.length; i++) {
    nominal = 0;
    for (let j = 0; j < matrix_bobot[i].length; j++) {
      nominal += Math.pow(matrix_bobot[i][j] - ideal_negatif[j], 2);
    }
    d_min.push(Math.sqrt(nominal));
  }
  return d_min;
}

function preferensi(d_plus, d_min) {
  preferensi = [];
  for (let i = 0; i < d_plus.length; i++) {
    preferensi.push(d_min[i] / (d_min[i] + d_plus[i]));
  }
  return preferensi;
}

function ranking(preferensi) {
  ranking = [];
  for (let i = 0; i < preferensi.length; i++) {
    ranking.push([preferensi[i]]);
  }
  ranking.sort();
  ranking.reverse();

  for (let i = 0; i < ranking.length; i++) {
    ranking[i].push(i + 1);
  }
  return ranking;
}

function filter() {
  // let inputKecamatan = document.querySelector('input[name="kecamatan"]');
  let selectedKecamatan = [];
  // for (let i = 0; i < inputKecamatan.length; i++) {
  //   if (inputKecamatan[i].checked) {
  //     selectedKecamatan.push(inputKecamatan[i].value);
  //   }
  // }

  selectedKecamatan.push(3201, 3202, 3203, 3204);

  return selectedKecamatan;
}

async function dataset() {
  const [umkm, wisatawan, transportasi, penduduk, daerah] = await Promise.all([get_umkm(), get_total_wisatawan(), get_transportation(), get_total_penduduk(), get_daerah()]);

  let data = [];

  for (let i = 0; i < daerah.length; i++) {
    if (filter().includes(daerah[i].bps_kota_kode)) {
      data.push({
        kota_kode: daerah[i].bps_kota_kode,
        kota_nama: daerah[i].bps_kota_nama,
        data: [wisatawan[i].jumlah_pengunjung, umkm[i].proyeksi_jumlah_umkm, transportasi[i].jumlah_moda_tranportasi_akdp, penduduk[i].jumlah_penduduk],
      });
    }
  }

  return data;
}

async function topsis() {
  const data = await dataset();
  let bobot = [5, 4, 3, 4, 3];

  const pembagi = matrix_pembagi(data);
  // return pembagi;
  const normalisasi = matrix_normalisasi(data, pembagi);
  // return normalisasi;
  const bobot_x = matrix_bobot(normalisasi, bobot);
  // return bobot_x;
  const ideal_positif_x = ideal_positif(bobot_x);
  // return ideal_positif_x;
  const ideal_negatif_x = ideal_negatif(bobot_x);
  // return ideal_negatif_x;
  const d_plus_x = d_plus(bobot_x, ideal_positif_x);
  // return d_plus_x;
  const d_min_x = d_min(bobot_x, ideal_negatif_x);
  // return d_min_x;
  const preferensi_x = preferensi(d_plus_x, d_min_x);
  // return preferensi_x;
  const ranking_x = ranking(preferensi_x);

  return ranking_x;
}

topsis().then((data) => console.log(data));
