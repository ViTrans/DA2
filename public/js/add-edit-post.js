import postApi from './api/postApi.js';
import { initPostForm, toast, convertObjectToFormData } from './utils/index.js';

async function handlePostFormSubmit(formValues) {
  try {
    const payLoad = convertObjectToFormData(formValues);
    const id = formValues?.id;
    console.log('payload ', payLoad);
    console.log('values paylooad ', formValues);
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
        longitude: '',
        latitude: '',
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
})();
