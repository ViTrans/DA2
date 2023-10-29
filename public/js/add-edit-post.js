import postApi from './api/postApi.js';
import { initPostForm, toast, convertObjectToFormData } from './utils/index.js';

async function handlePostFormSubmit(formValues) {
  try {
    const payLoad = convertObjectToFormData(formValues);
    const id = formValues?.id;

    const response = id
      ? await postApi.updatedFormData(payLoad)
      : await postApi.addFormData(payLoad);

    await toast.fire({
      icon: 'success',
      title: 'save post successfully',
    });
    setTimeout(() => {
      window.location.assign('http://localhost:5000/posts');
    }, undefined);
  } catch (error) {
    await toast.fire({
      icon: 'error',
      title: 'save post failed',
    });
    console.error('error ::: ', error);
  }
}
(async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get('id');
  const defaultFormValues = id
    ? await postApi.getById(id)
    : {
        acreage: '',
        title: '',
        address: '',
        category: '',
        description: '',
        district: '',
        images: '',
        price: '',
      };

  // Khởi tạo bản đồ
  var map = L.map('map').setView([0, 0], 10);

  // Thêm tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  initPostForm({  
    formId: 'postForm',
    defaultFormValues,
    L,
    map,
    onSubmit: async (value) => await handlePostFormSubmit(value),
  });

  // Ví dụ địa chỉ muốn đặt lại đánh dấu
  // var address = '201/12, asdasdasPhường Châu Phú B, Thành phố Châu Đốc, Tỉnh An Giang';

  // // Gửi yêu cầu đến OpenStreetMap Nominatim API
  // fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
  //   .then((response) => response.json())
  //   .then((data) => {
  //     if (data.length > 0) {
  //       let marker = undefined;
  //       // Lấy tọa độ từ kết quả
  //       var latitude = parseFloat(data[0].lat);
  //       var longitude = parseFloat(data[0].lon);

  //       // Xóa đánh dấu hiện tại (nếu có)
  //       if (typeof marker !== 'undefined') {
  //         map.removeLayer(marker);
  //       }

  //       // Đặt lại đánh dấu mới
  //       console.log(latitude);
  //       console.log(longitude);
  //       marker = L.marker([latitude, longitude]).addTo(map);
  //       map.setView([latitude, longitude], 10);
  //     } else {
  //       console.log('Không tìm thấy địa chỉ');
  //     }
  //   })
  //   .catch((error) => {
  //     console.error('Lỗi khi tìm kiếm địa chỉ:', error);
  //   });
})();
