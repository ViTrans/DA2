// province;
// district;
// ward;
const postForm = document.getElementById('create-post-form');
const address = document.querySelector('input[name="address"]');
const houseNumber = document.querySelector('input[name="houseNumber"]');
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
  province.addEventListener('change', (e) => {
    address.value = `${province?.options[province.selectedIndex].text} ${
      district?.options[district.selectedIndex].text
    } ${ward?.options[ward.selectedIndex].text} ${houseNumber.value}`;
  });
  district.addEventListener('change', (e) => {
    address.value = `${province?.options[province.selectedIndex].text} ${
      district?.options[district.selectedIndex].text
    } ${ward?.options[ward.selectedIndex].text} ${houseNumber.value}`;
  });
  ward.addEventListener('change', (e) => {
    address.value = `${province?.options[province.selectedIndex].text} ${
      district?.options[district.selectedIndex].text
    } ${ward?.options[ward.selectedIndex].text} ${houseNumber.value}`;
  });
  houseNumber.addEventListener('input', (e) => {
    address.value = `${province?.options[province.selectedIndex].text} ${
      district?.options[district.selectedIndex].text
    } ${ward?.options[ward.selectedIndex].text} ${houseNumber.value}`;
  });

  jQuery.validator.setDefaults({
    focusCleanup: true,
    errorElement: 'div',
    highlight: function (element, errorClass, validClass) {},
    errorPlacement: function (error, element) {
      console.log(element.parent());
      $(element).parent().append(error);
    },
  });
  jQuery('#create-post-form').validate({
    rules: {
      province: {
        required: true,
      },
      district: {
        required: true,
      },
      category: {
        required: true,
      },
      acreage: {
        required: true,
        minlength: 6,
        digits: true,
      },
      houseNumber: {
        minlength: 10,
        required: true,
        digits: true,
      },
      price: {
        minlength: 7,
        required: true,
        digits: true,
      },
      address: {
        required: true,
      },
      ward: {
        required: true,
      },
      title: 'required',
      email: {
        required: true,
        email: true,
      },
      description: {
        required: true,
        minlength: 5,
      },
    },
    messages: {
      province: 'vui lòng nhập tỉnh',
      category: 'vui lòng nhập danh mục',
      title: 'Please enter your title',
      address: 'Please enter your address',
      district: 'Please enter your district',
      ward: 'Please enter your ward',
      email: {
        required: 'Please enter email',
        email: 'Please enter valid email',
      },
      description: {
        required: 'Please enter your description',
        minlength: 'description must be 5 char long',
      },
      price: {
        required: 'vui lòng nhập giá',
        minlength: 'Gía phải từ 100000 đồng',
      },
    },
  });

  // =======================
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
