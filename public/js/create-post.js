import postApi from './api/postApi.js';
import categoryApi from './api/categoryApi.js';
import getLocations from './province.js';
import { getFileUpload } from './selector.js';

async function renderCategories(form) {
  if (!form) return;

  const selectBoxElement = form.querySelector('select[name="category"]');
  if (!selectBoxElement) return;
  const { categories } = await categoryApi.getAll();
  console.log('categories API', categories);
  categories.forEach((category) => {
    const optionElement = document.createElement('option');
    optionElement.value = category._id;
    optionElement.textContent = category.title;
    selectBoxElement.appendChild(optionElement);
  });
}

function getFormValues(form) {
  let defaultFormValues = {};
  // defaultFormValues['file'] = file.files;
  defaultFormValues['file'] = [];
  const formData = new FormData(form);
  for (const [key, value] of formData) {
    if (typeof value === 'object') {
      defaultFormValues['file'].push(value);
    } else {
      defaultFormValues[key] = value;
    }
  }

  return defaultFormValues;
}

function getPostSchema() {
  const { MB3 } = {
    MB3: 3 * 1024 * 1024,
  };

  const postSchema = joi
    .object({
      province: joi.string().min(1),
      ward: joi.string().min(1),
      district: joi.string().min(1),
      acreage: joi.string().min(3),
      price: joi.string().min(4),
      houseNumber: joi.string().min(4),
      address: joi.string().min(20),
      category: joi.string().min(10),
      title: joi.string().min(7),
      description: joi.string().min(100),
      file: joi
        .any()
        .custom((file, helpers) => {
          for (const f of file) {
            if (f.size > MB3) {
              return helpers.error('any.maxSize');
            }
            if (f?.size <= 0) return helpers.error('any.invalid');
          }
          return file;
        }, 'image validation')
        .message({
          'any.invalid': 'Vui lòng chọn ảnh',
          'any.maxSize': 'Ảnh tối đa 3mb',
        }),
    })
    .options({ abortEarly: false, allowUnknown: true });
  return postSchema;
}

function setFieldError(form, name, error) {
  const filed = form.querySelector(`[name="${name}"]`);
  if (!filed) return;

  filed.setCustomValidity(error);
  const formGroup = filed.closest('.form-group');
  const errorElement = formGroup.querySelector('.invalid-feedback');
  if (!errorElement) return;

  errorElement.textContent = error;
}
async function validationPostForm(form, formValues) {
  // reset validation fileds
  [
    'houseNumber',
    'address',
    'ward',
    'acreage',
    'title',
    'province',
    'category',
    'description',
    'district',
    'file',
    'price',
  ].forEach((name) => {
    setFieldError(form, name, '');
  });

  try {
    const postSchema = getPostSchema();

    await postSchema.validateAsync(formValues);
    // await postSchema.validateAsync(formValues);
  } catch (error) {
    for (const field of error.details) {
      console.log('message error ::', field.message);
      setFieldError(form, field.path, field.message);
    }
    console.log(error);
  }

  const isVaild = form.checkValidity();
  form.classList.add('was-validated');
  console.log('valid ::', isVaild);
  return isVaild;
}

function initUploadImage(form) {
  let inputFiles = getFileUpload(form);
  if (!inputFiles) return;
  const imageContainer = document.getElementById('image-list');

  inputFiles.addEventListener('change', ({ target }) => {
    imageContainer.innerHTML = '';

    const fileList = target.files;
    validateFormField(
      form,
      {
        ['file']: fileList,
      },
      'file'
    );
    for (const [index, file] of Object.entries(fileList)) {
      const imageURL = URL.createObjectURL(file);
      const imgElment = document.createElement('img');
      imgElment.classList.add('img-fuild');
      imgElment.src = imageURL;
      imgElment.dataset.index = index;
      imageContainer.appendChild(imgElment);
    }
  });

  imageContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      const imgElement = e.target;
      imgElement.remove();
      // get all files
      const fileList = inputFiles.files;

      // convert to array
      const uploadFiles = [...fileList];
      const index = parseInt(imgElement.dataset.index);
      console.log('index: ' + index);

      uploadFiles.splice(index, 1);

      const remainingImages = imageContainer.querySelectorAll('img');
      remainingImages.forEach((img, i) => {
        if (i >= index) {
          img.dataset.index = i;
        }
      });

      //  convert elements sang  DOM
      const dataTransfer = new DataTransfer();
      uploadFiles.forEach((file) => {
        dataTransfer.items.add(file);
      });

      const newFileList = dataTransfer.files;
      inputFiles.value = null;
      inputFiles.files = newFileList;
    }
  });
}

function initPostForm({ formId, onSubmit }) {
  const form = document.getElementById(formId);

  initUploadImage(form);
  initFieldOnchange(form);
  renderCategories(form);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formValues = getFormValues(form);
    console.log('submit form', formValues);
    const isVaild = await validationPostForm(form, formValues);
    if (isVaild) {
      onSubmit?.(formValues);
    }
  });
}

async function validateFormField(form, formValues, name) {
  // reset filed errors
  setFieldError(form, name, '');
  const field = form.querySelector(`[name="${name}"]`);

  if (!field) return;
  console.log('filed validation ', field);
  try {
    const postSchema = getPostSchema();

    await postSchema.validateAsync(formValues);
  } catch (error) {
    const errorMessage = error.details[0].message;
    setFieldError(form, name, errorMessage);
  }
  const formGroup = field.closest('.form-group');
  formGroup.classList.add('was-validated');
}

function initFieldOnchange(form) {
  // reset error empty
  const fields = [
    'province',
    'ward',
    'district',
    'acreage',
    'price',
    'houseNumber',
    'address',
    'category',
    'title',
    'description',
  ];
  fields.forEach((name) => {
    setFieldError(form, name, '');
  });
  const filedSelectOptions = ['province', 'category', 'ward', 'district', 'address'];

  fields.forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return;

    if (filedSelectOptions.includes(name)) {
      field.addEventListener('change', (e) => {
        const data = e.target.value;

        validateFormField(
          form,
          {
            [name]: data,
          },
          name
        );
      });
    } else {
      field.addEventListener('input', (e) => {
        const data = e.target.value;
        if (name === 'price' && data) {
          field.value = formartPriceNumber(data);
        }
        validateFormField(
          form,
          {
            [name]: data,
          },
          name
        );
      });
    }
  });
}
function formartPriceNumber(data) {
  const formartString = data.replace(/[^0-9]+/g, '');
  const number = parseInt(formartString);
  return number.toLocaleString('vi');
}
function convertObjectToFormData(data) {
  const formData = new FormData();

  for (const key in data) {
    if (key === 'file') {
      const files = data[key];
      if (Array.isArray(files)) {
        for (const file of files) {
          formData.append(key, file);
        }
      } else {
        formData.append(key, files);
      }
    } else {
      formData.append(key, data[key]);
    }
  }

  return formData;
}
(async () => {
  await getLocations();

  initPostForm({
    formId: 'postForm',
    onSubmit: (value) => handlePostFormSubmit(value),
  });
})();

async function handlePostFormSubmit(formValues) {
  try {
    const payLoad = convertObjectToFormData(formValues);
    const response = await postApi.addFormData(payLoad);
    // await toast.fire({
    //   icon: 'success',
    //   title: 'save post successfully',
    // });
    // setTimeout(() => {
    //   window.location.assign('http://localhost:5001/admin/posts');
    // }, 10);
    console.log('check response : ', response);
  } catch (error) {
    // await toast.fire({
    //   icon: 'error',
    //   title: 'save post failed',
    // });
    console.error('error ::: ', error);
  }
}
