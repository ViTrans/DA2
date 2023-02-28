// province;
// district;
// ward;
const postForm = document.getElementById('create-post-form');

const province = postForm.querySelector('#province');
const district = postForm.querySelector('#district');
const ward = postForm.querySelector('#ward');
const street = postForm.querySelector('#street');
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// https://provinces.open-api.vn/api/

const baseURLProvinces = 'https://provinces.open-api.vn/api/';
const getAPi = async () => {
  try {
    const response = await axiosClient.get('/', {
      baseURL: baseURLProvinces,
    });

    renderOptions(response.data, province);
  } catch (error) {}
};

(async () => {
  await getAPi();

  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('form submit');
  });
})();

const renderOptions = (data, selector) => {
  const options = data.map((element) => {
    return `<option value="${element.code}">${element.name}</option>`;
  });
  selector.innerHTML += options.join('');
};

province.addEventListener('change', () => {
  getDistrict();
});

district.addEventListener('change', () => {
  getWard();
});

async function getWard() {
  try {
    const districtValue = district.value;
    const resource = `d/${districtValue}?depth=2`;

    const response = await axiosClient.get(resource, {
      baseURL: baseURLProvinces,
    });

    console.log(response.data.wards);
    renderOptions(response.data.wards, ward);
  } catch (error) {}
}

async function getDistrict() {
  try {
    const provinceValue = province.value;
    const resource = `p/${provinceValue}?depth=2`;

    const response = await axiosClient.get(resource, {
      baseURL: baseURLProvinces,
    });

    console.log(response.data.districts);
    renderOptions(response.data.districts, district);
  } catch (error) {}
}
