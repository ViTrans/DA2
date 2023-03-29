import axiosClient from './api/axiosClient.js';

const baseURLProvinces = 'https://provinces.open-api.vn/api/';

async function getWard() {
  try {
    const districtValue = district.value;
    const resource = `d/${districtValue}?depth=2`;

    const response = await axiosClient.get(resource, {
      baseURL: baseURLProvinces,
    });

    renderOptions(response.wards, ward);
    ward.focus();
  } catch (error) {}
}

async function getDistrict() {
  try {
    const provinceValue = province.value;
    const resource = `p/${provinceValue}?depth=2`;

    const response = await axiosClient.get(resource, {
      baseURL: baseURLProvinces,
    });

    renderOptions(response.districts, district);
    district.focus();
  } catch (error) {}
}

function clearOptions(selectBoxElement) {
  // Lấy ra danh sách tất cả các options trong selectbox
  console.log('setOptions', selectBoxElement);
  var options = selectBoxElement.getElementsByTagName('option');

  // Duyệt qua từng option, bắt đầu từ index 1 (tức là từ option thứ 2 trở đi)
  for (var i = 1; i < options.length; i++) {
    selectBoxElement.removeChild(options[i]);
  }
}

function setTextContentAddress(houseNumber, ward, district, province, address) {
  address.value = '';
  let data = '';
  if (houseNumber.value) data += ' ' + houseNumber.value;
  if (ward?.options[ward.selectedIndex].value) data += ward?.options[ward.selectedIndex].text;
  if (district?.options[district.selectedIndex].value)
    data += district?.options[district.selectedIndex].text;
  if (province?.options[province.selectedIndex].value)
    data += province?.options[province.selectedIndex].text;
  // address.value = data.split('').join(' ');
  // Xã Ngọc KhêHuyện Trùng KhánhTỉnh Cao Bằng
  console.log(data);
  let str = data.replace(/Huyện/g, ', Huyện').replace(/Tỉnh/g, ', Tỉnh').replace(/Xã/g, ', Xã');
  // str = str.trim();
  str = str.substring(0, str.length);
  address.value = str.trim();
}
const renderOptions = (data, selector) => {
  const options = data.map((element) => {
    return `<option value="${element.code}">${element.name}</option>`;
  });
  selector.innerHTML += options.join('');
};
const getLocations = async (form) => {
  try {
    const form = document.getElementById('postForm');
    const address = form.querySelector('input[name="address"]');
    const houseNumber = form.querySelector('input[name="houseNumber"]');
    const province = form.querySelector('#province');
    const district = form.querySelector('#district');
    const ward = form.querySelector('#ward');

    // render province
    const response = await axiosClient.get('/', {
      baseURL: baseURLProvinces,
    });
    renderOptions(response, province);

    province.addEventListener('change', () => {
      getDistrict();
    });

    district.addEventListener('change', () => {
      getWard();
    });

    province.addEventListener('change', (e) => {
      if (province?.options[province.selectedIndex].value !== '') {
        setTextContentAddress(houseNumber, ward, district, province, address);
      } else {
        address.value = '';
        [district, ward, houseNumber].forEach((element) => clearOptions(element));
      }
    });
    district.addEventListener('change', (e) => {
      if (
        province?.options[province.selectedIndex].value !== '' &&
        district?.options[district.selectedIndex].value
      ) {
        setTextContentAddress(houseNumber, ward, district, province, address);
      } else {
        address.value = '';
        // [district, ward, houseNumber].forEach((element) => clearOptions(element));
      }
    });
    ward.addEventListener('change', (e) => {
      if (
        province?.options[province.selectedIndex].value !== '' &&
        district?.options[district.selectedIndex].value &&
        ward?.options[ward.selectedIndex].value !== ''
      ) {
        setTextContentAddress(houseNumber, ward, district, province, address);
      } else {
        address.value = '';
        // [district, ward, houseNumber].forEach((element) => clearOptions(element));
      }
    });
    houseNumber.addEventListener('input', (e) => {
      if (
        province?.options[province.selectedIndex].value !== '' &&
        district?.options[district.selectedIndex].value &&
        ward?.options[ward.selectedIndex].value !== ''
      ) {
        setTextContentAddress(houseNumber, ward, district, province, address);
      } else {
        address.value = '';
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default getLocations;
