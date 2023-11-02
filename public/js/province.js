import { renderOptions, clearOptions, validateFormField, setFieldError } from './utils/index.js';
import locationApi from './api/locationApi.js';

async function fetchLocationInfo(data, location, form) {
  if (!location || !data) return;

  switch (location) {
    case 'province':
      ['district', 'ward'].forEach((name) => clearOptions(name));
      const district = await locationApi.getDistrict(data);
      renderOptions(district.districts, 'district', form);
      break;
    case 'district':
      clearOptions('ward');
      const ward = await locationApi.getWard(data);
      renderOptions(ward.wards, 'ward', form);
      break;
    default:
      break;
  }
}

export function setAddressValue(form, L, map) {
  const address = form.querySelector(`[name="address"]`);
  const houseNumber = form.querySelector(`[name="houseNumber"]`);

  let str = '';
  const filedSelectOptions = ['ward', 'district', 'province'];
  str += houseNumber.value;

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
    .replace(/Thị xã/g, ', Huyện')
    .replace(/Thị trấn/g, ', Thị trấn')
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
  const apiKey = 'LLdcdVjZhgjmo3jl7opmh0fh3w4wGI4W';
  fetch(
    `https://www.mapquestapi.com/geocoding/v1/address?key=${apiKey}&inFormat=kvp&outFormat=json&location=${encodeURIComponent(
      addressMap
    )}&thumbMaps=false&maxResults=1`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log('data', data);
      if (typeof marker !== 'undefined') {
        map.removeLayer(marker);
      }
      const result = data.results[0];

      if (result.locations && result.locations.length > 0) {
        const location = result.locations[0];

        if (location.geocodeQualityCode === 'A1XAX') {
          return setFieldError(form, 'address', 'Không tìm thấy địa chỉ trên');
        }

        // xu lí data
        const latitude = location.latLng.lat;
        const longitude = location.latLng.lng;
        marker = L.marker([latitude, longitude]).addTo(map);
        map.setView([latitude, longitude], 80);
        const markerPopupContent = addressMap;
        const popup = L.popup().setContent(markerPopupContent);
        marker.bindPopup(popup).openPopup();
        setFieldError(form, 'address', '');

        // bắn event

        let event = new CustomEvent('savePosition', {
          bubbles: true,
          detail: { latitude: latitude, longitude: longitude },
        });
        const addressInput = form.querySelector(`[name="address"]`);
        addressInput.dispatchEvent(event);
      }
      // if (data.length > 0) {
      //   // let marker = undefined;
      //   // Lấy tọa độ từ kết quả
      //   // var latitude = parseFloat(data[0].lat);
      //   // var longitude = parseFloat(data[0].lon);

      //   // Xóa đánh dấu hiện tại (nếu có)
      //   if (typeof marker !== 'undefined') {
      //     map.removeLayer(marker);
      //   }
      //   console.log('data ', data);
      //   console.log('maker ', marker);

      //   marker = L.marker([latitude, longitude]).addTo(map);
      //   map.setView([latitude, longitude], 10);
      //   setFieldError(form, 'address', '');
      // } else {
      //   console.log('Không tìm thấy địa chỉ');
      //   setFieldError(form, 'address', 'Không tìm thấy địa chỉ');
      // }
    })
    .catch((error) => {
      map.removeLayer(marker);
      setFieldError(form, 'address', 'Không tìm thấy địa chỉ');
    });
}
// "adminArea1": "VN",
export function initOnchangeLocation(form, L, map) {
  const filedSelectOptions = ['province', 'ward', 'district'];

  filedSelectOptions.forEach((name) => {
    const filed = form.querySelector(`[name="${name}"]`);
    if (!filed) return;

    filed.addEventListener('change', ({ target }) => {
      const selectedValue = target.options[target.selectedIndex].value;
      const filedName = target.name;
      fetchLocationInfo(selectedValue, filedName, form);
      setAddressValue(form, L, map);
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
