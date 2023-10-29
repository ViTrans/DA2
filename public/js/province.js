import { renderOptions, clearOptions, validateFormField, setFieldError } from './utils/index.js';
import locationApi from './api/locationApi.js';

async function fetchLocationInfo(data, location, form) {
  if (!location || !data) return;

  switch (location) {
    case 'province':
      const district = await locationApi.getDistrict(data);
      ['district', 'ward'].forEach((name) => clearOptions(name));
      renderOptions(district.districts, 'district', form);
      break;
    case 'district':
      const ward = await locationApi.getWard(data);
      clearOptions('ward');
      renderOptions(ward.wards, 'ward', form);
      break;
    default:
      break;
  }
}

export function setAddressValue(form, housnumber = '', L, map) {
  const address = form.querySelector(`[name="address"]`);

  let str = '';
  const filedSelectOptions = ['ward', 'district', 'province'];
  if (housnumber) str += housnumber;

  filedSelectOptions.forEach((name) => {
    const filed = form.querySelector(`[name="${name}"]`);
    if (!filed) return;
    const filedValue = filed.options[filed.selectedIndex].value;
    if (!filedValue) return;

    str += filed.options[filed.selectedIndex].text;
  });
  str = str
    .replace(/Thành/g, ', Thành')
    .replace(/Huyện/g, ', Huyện')
    .replace(/Phường/g, ', Phường')
    .replace(/Quận/g, ', Quận')
    .replace(/Tỉnh/g, ', Tỉnh')
    .replace(/Xã/g, ', Xã');
  str = str.substring(0, str.length);
  address.value = str.trim();

  // xu li map
  const addressMap = str.trim();

  // Gửi yêu cầu đến OpenStreetMap Nominatim API
  findAddress(form, addressMap, L, map);
  const formGroup = address.closest('.form-group');
  formGroup.classList.add('was-validated');
}
var marker;
export function findAddress(form, addressMap, L, map) {
  console.log('address map ', addressMap);
  fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressMap)}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        // let marker = undefined;
        // Lấy tọa độ từ kết quả
        var latitude = parseFloat(data[0].lat);
        var longitude = parseFloat(data[0].lon);

        // Xóa đánh dấu hiện tại (nếu có)
        // if (typeof marker !== 'undefined') {
        map.removeLayer(marker);
        // }
        console.log('data ', data);
        // Đặt lại đánh dấu mới
        console.log(latitude);
        console.log(longitude);

        marker = L.marker([latitude, longitude]).addTo(map);
        map.setView([latitude, longitude], 10);
        setFieldError(form, 'address', '');
      } else {
        console.log('Không tìm thấy địa chỉ');
        setFieldError(form, 'address', 'Không tìm thấy địa chỉ');
      }
    })
    .catch((error) => {
      console.error('Lỗi khi tìm kiếm địa chỉ:', error);
      setFieldError(form, 'address', 'Không tìm thấy địa chỉ');
    });
}

export function initOnchangeLocation(form, L, map) {
  const filedSelectOptions = ['province', 'ward', 'district'];

  filedSelectOptions.forEach((name) => {
    const filed = form.querySelector(`[name="${name}"]`);
    if (!filed) return;

    filed.addEventListener('change', ({ target }) => {
      const selectedValue = target.options[target.selectedIndex].value;
      const filedName = target.name;
      fetchLocationInfo(selectedValue, filedName, form);
      setAddressValue(form, false, L, map);
      validateFormField(
        form,
        {
          [filedName]: selectedValue,
        },
        filedName
      );
    });
  });
}
