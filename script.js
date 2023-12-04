const api_kecamatan_url = "https://opendata.sumedangkab.go.id/index.php/api/62973ba055b5e";
const api_penduduk_url = "https://opendata.sumedangkab.go.id/index.php/api/61493671239d6";
const api_imb_url = "https://opendata.sumedangkab.go.id/index.php/api/63bf79c168f59";
const api_kriminal_url = "https://opendata.sumedangkab.go.id/index.php/api/61f10d9a00b06";
const api_wisatawan_url = "https://opendata.sumedangkab.go.id/index.php/api/61d6493fdaea0";

async function fetchData(url) {
  try {
    const response = await fetch(url, {
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("failed fetching data" + err);
  }
}

async function data_kecamatan() {
  const dataKecamatan = await fetchData(api_kecamatan_url);

  let kecamatan = [];

  for (let i = 1; i < dataKecamatan.length; i++) {
    let obj = {
      no: i,
      kecamatan: dataKecamatan[i][2],
    };
    kecamatan.push(obj);
  }

  return kecamatan;
}

async function data_usaha_mikro() {
  const dataUsaha = await fetchData(api_kecamatan_url);

  let usaha = [];

  for (let i = 1; i < dataUsaha.length; i++) {
    let obj = {
      no: i,
      kecamatan: dataUsaha[i][2],
      jumlah: dataUsaha[i][6],
    };
    usaha.push(obj);
  }

  return usaha;
}

async function data_usaha_kecil() {
  const dataUsaha = await fetchData(api_kecamatan_url);

  let usaha = [];

  for (let i = 1; i < dataUsaha.length; i++) {
    let obj = {
      no: i,
      kecamatan: dataUsaha[i][2],
      jumlah: dataUsaha[i][7],
    };
    usaha.push(obj);
  }

  return usaha;
}

async function data_usaha_sedang() {
  const dataUsaha = await fetchData(api_kecamatan_url);

  let usaha = [];

  for (let i = 1; i < dataUsaha.length; i++) {
    let obj = {
      no: i,
      kecamatan: dataUsaha[i][2],
      jumlah: dataUsaha[i][8],
    };
    usaha.push(obj);
  }

  return usaha;
}

async function data_usaha_total() {
  const dataUsaha = await fetchData(api_kecamatan_url);

  let usaha = [];

  for (let i = 1; i < dataUsaha.length; i++) {
    let obj = {
      no: i,
      kecamatan: dataUsaha[i][2],
      jumlah: parseInt(dataUsaha[i][6]) + parseInt(dataUsaha[i][7]) + parseInt(dataUsaha[i][8]),
    };
    usaha.push(obj);
  }

  return usaha;
}

async function data_imb() {
  const dataImb = await fetchData(api_imb_url);

  let imb = [];

  for (let i = 1; i < dataImb.length; i++) {
    let obj = {
      no: i,
      kecamatan: dataImb[i][1],
      jumlah: dataImb[i][2],
    };
    imb.push(obj);
  }

  return imb;
}

async function data_kriminal() {
  const dataKriminal = await fetchData(api_kriminal_url);

  let kriminal = [];

  for (let i = 1; i < dataKriminal.length; i++) {
    let obj = {
      no: i,
      kecamatan: dataKriminal[i][1].replace(/\[\d+\]/, "").trim(),
      jumlah: dataKriminal[i][2],
      risiko: dataKriminal[i][3],
    };
    kriminal.push(obj);
  }

  return kriminal;
}

async function data_wisatawan() {
  const dataWisatawan = await fetchData(api_wisatawan_url);

  let wisatawan = [];

  for (let i = 1; i < dataWisatawan.length; i++) {
    let obj = {
      no: i,
      kecamatan: dataWisatawan[i][1],
      mancanegara: dataWisatawan[i][2],
      domestik: dataWisatawan[i][3],
      total: dataWisatawan[i][4],
    };
    wisatawan.push(obj);
  }

  return wisatawan;
}

async function data_penduduk() {
  const dataPenduduk = await fetchData(api_penduduk_url);

  let penduduk = [];

  for (let i = 1; i < dataPenduduk.length; i++) {
    let obj = {
      no: i,
      kecamatan: dataPenduduk[i][1],
      total: dataPenduduk[i][4],
    };
    penduduk.push(obj);
  }

  return penduduk;
}

let bobot = {
  penduduk: 2,
  imb: 1,
  kriminal: 2,
  wisatawan: 3,
  usaha: 3,
};

const status_kriteria = {
  penduduk: "benefit",
  imb: "benefit",
  kriminal: "cost",
  wisatawan: "benefit",
  usaha: "cost",
};

function input_data() {
  const penduduk = "";
  const imb = "";
  const kriminal = "";
  const wisatawan = "";
  const usaha = "";

  if (penduduk == "" && imb == "" && kriminal == "" && wisatawan == "" && usaha == "") {
    return bobot;
  } else {
    return {
      penduduk: penduduk,
      imb: imb,
      kriminal: kriminal,
      wisatawan: wisatawan,
      usaha: usaha,
    };
  }
}

async function dataset() {
  const kecamatan = await data_kecamatan();
  const usaha = await data_usaha_total();
  const imb = await data_imb();
  const kriminal = await data_kriminal();
  const wisatawan = await data_wisatawan();
  const penduduk = await data_penduduk();
  // const input = input_data();

  data = [];

  const selectedKecamatan = filter();

  for (let i = 0; i < kecamatan.length; i++) {
    if (selectedKecamatan.includes(kecamatan[i].kecamatan.toLowerCase())) {
      let obj = {
        no: kecamatan[i].no,
        kecamatan: kecamatan[i].kecamatan.toLowerCase(),
        usaha: parseFloat(usaha[i].jumlah),
        imb: parseFloat(imb[i].jumlah),
        kriminal: parseFloat(kriminal[i].jumlah),
        wisatawan: parseFloat(wisatawan[i].total),
        penduduk: parseFloat(penduduk[i].total),
      };
      data.push(obj);
    }
  }

  return data;
}

function filter() {
  // let input = document.querySelector('input[name="kecamatan"]');
  let input = "jatinangor";
  let selectedKecamatan = [];
  // input.forEach((data) => {
  //   if (data.checked) {
  //     selectedKecamatan.push(data.value);
  //   }
  // });
  selectedKecamatan.push(input, "sumedang");

  return selectedKecamatan;
}

function topsis() {
  const data = dataset();
  const bobot = input_data();
  const status_kriteria = status_kriteria;

  let normalizedMatrix = data.map;

  return data;
}

// data_penduduk().then((data) => {
//   console.log(data);
// });

topsis().then((data) => {
  console.log(data);
});

// console.log(filter());
