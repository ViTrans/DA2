import postApi from './api/postApi.js';

async function handelFilterChange(filterObjectValues) {
  // code

  // asdasdasd
  const queryPamrams = new URL(window.location);
  for (const [filterName, filterValue] of Object.entries(filterObjectValues)) {
    if (filterName) queryPamrams.searchParams.set(filterName, filterValue);
    if (filterName === 'title' || filterName === 'category')
      queryPamrams.searchParams.delete('page');
    if (filterName === 'title' && filterValue == '') queryPamrams.searchParams.delete('title');
    if (filterName === 'category' && filterValue == '')
      queryPamrams.searchParams.delete('category');
  }

  history.pushState({}, '', queryPamrams);
  const { data, pagination } = await postApi.getAllUserPosts(queryPamrams.searchParams);
  console.log(data);

  renderPostList({
    elemntId: 'postList',
    data,
  });

  const { pageActive, ulPagination, prevLiPagination, nextLiPagination } = renderPagination({
    elemntId: 'pagination',
    pagination,
  });

  handelClickPage({
    pageActive,
    ulPagination,
    prevLiPagination,
    nextLiPagination,
    onChange: (page) => {
      handelFilterChange({ ['page']: page });
    },
  });
}

function handelClickPage({
  pageActive,
  ulPagination,
  prevLiPagination,
  nextLiPagination,
  onChange,
}) {
  // get totalPage and curent page
  const totalPages = ulPagination.dataset.totalPages;
  const page = ulPagination.dataset.page;
  const prevPage = prevLiPagination.firstElementChild;
  const nextPage = nextLiPagination.firstElementChild;

  if (page < 2) prevPage.classList.add('disabled');
  if (page >= totalPages) nextPage.classList.add('disabled');

  prevPage.addEventListener('click', (e) => {
    e.preventDefault();

    const pageIndex = +page - 1;
    onChange?.(pageIndex);
  });
  nextPage.addEventListener('click', (e) => {
    e.preventDefault();

    const pageIndex = +page + 1;
    onChange?.(pageIndex);
  });

  const pageNumbers = ulPagination.querySelectorAll('li.page-number');
  pageNumbers.forEach((pageNumber, index) => {
    pageNumber.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.target.closest('li');
      if (!page) return;

      pageActive.classList.remove('active');
      const pageIndex = +page.firstElementChild.textContent;
      console.log(pageIndex);
      page.classList.add('active');
      onChange?.(pageIndex);
    });
  });
}

function renderPagination({ elemntId, pagination }) {
  const ulPagination = document.getElementById(elemntId);
  if (!ulPagination) return;

  // reset page
  ulPagination.textContent = '';
  const prevLiPagination = document.createElement('li');
  prevLiPagination.classList.add('page-item');
  const prevPage = document.createElement('a');
  prevPage.innerHTML = '&laquo';
  prevPage.href = '';
  prevPage.classList.add('page-link');

  const nextLiPagination = document.createElement('li');
  nextLiPagination.classList.add('page-item');
  const nextPage = document.createElement('a');
  nextPage.href = '';
  nextPage.innerHTML = '&raquo';
  nextPage.classList.add('page-link');

  prevLiPagination.appendChild(prevPage);
  nextLiPagination.appendChild(nextPage);

  if (!prevLiPagination || !nextLiPagination) return;
  ulPagination.appendChild(prevLiPagination);
  ulPagination.appendChild(nextLiPagination);
  // save page
  ulPagination.dataset.totalPages = pagination.totalPages;
  ulPagination.dataset.page = pagination.page;

  const currentPage = pagination.page;
  let pageActive = null;
  for (let page = 1; page <= pagination.totalPages; page++) {
    const liPagination = document.createElement('li');
    liPagination.classList.add('page-item');
    liPagination.classList.add('page-number');

    const pageNumber = document.createElement('a');
    pageNumber.classList.add('page-link');
    pageNumber.href = '';
    pageNumber.textContent = page;
    liPagination.appendChild(pageNumber);

    // active page
    if (currentPage == page) {
      pageActive = liPagination;
      pageActive.classList.add('active');
    }
    ulPagination.insertBefore(liPagination, ulPagination.children[page]);
  }
  return {
    pageActive,
    ulPagination,
    prevLiPagination,
    nextLiPagination,
  };
}

//  <td data-id="title"></td>
//     <td data-id="category"></td>
//     <td data-id="user"></td>
//     <td data-id="status"></td>
//     <td data-id="package"></td>
//     <td data-id="price"></td>
//     <td data-id="date"></td>
//     <td data-id="action"></td>

function createPostElement(post, index) {
  const postTemplate = document.getElementById('postTemplate').cloneNode(true).content;
  const trElement = postTemplate.firstElementChild;
  let ordinalNumber = index + 1;
  if (!trElement || !post) return;

  const title = trElement.querySelector('[data-id="title"]');
  if (!title) return;
  title.textContent = post?.title;

  const pack = trElement.querySelector('[data-id="pack"]');
  if (!pack) return;
  pack.textContent = post?.pack;

  const user = trElement.querySelector('[data-id="user"]');
  if (!user) return;
  user.textContent = post?.username;

  const category = trElement.querySelector('[data-id="category"]');
  if (!category) return;
  category.textContent = post?.categoryName;

  const vip = trElement.querySelector('[data-id="vip"]');
  if (!vip) return;
  vip.textContent = post?.isvip;

  const status = trElement.querySelector('[data-id="status"]');
  if (!status) return;
  status.textContent = post?.status;

  const price = trElement.querySelector('[data-id="price"]');
  if (!price) return;
  price.textContent = post?.price;

  const number = trElement.querySelector('[data-id="number"]');
  if (!number) return;
  number.textContent = ordinalNumber;

  const date = trElement.querySelector('[data-id="date"]');
  if (!date) return;
  date.textContent = post?.createdAt;

  const buttons = trElement.querySelector('[data-id="action"]');
  if (!buttons) return;

  const image = trElement.querySelector('[data-id="image"]').firstElementChild;
  if (!image) return;
  image.src = post?.images[0];

  const removeButton = buttons.querySelector('#remove-btn');

  removeButton.addEventListener('click', () => {
    const trElement = removeButton.closest('tr');

    if (!trElement) return;
    let event = new CustomEvent('removePost', {
      bubbles: true,
      detail: { elemntId: trElement, id: post._id },
    });
    removeButton.dispatchEvent(event);
  });
  ordinalNumber++;
  return trElement;
}

function initRemovePost() {
  document.addEventListener('removePost', async (e) => {
    try {
      const trElement = e.detail.elemntId;
      Swal.fire({
        title: 'Bạn có chắc là xóa?',
        text: 'Nếu xóa thì bài viết sẽ biến mất hoàn toàn trong database!',
        icon: 'warning',
        showCancelButton: true,
        width: 600,
        height: 800,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log('id ', e.target.id);
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          trElement.remove();
          await postApi.removeById(e.detail.id);
          await toast.fire({
            icon: 'success',
            title: 'delete post successfully',
          });
          await handelFilterChange();
        }
      });
    } catch (error) {
      console.log(error);
      await toast.fire({
        icon: 'error',
        title: 'delete post failed',
      });
    }
  });
}

function renderPostList({ elemntId, data }) {
  const postList = document.getElementById(elemntId);
  if (!postList) return;
  postList.textContent = '';
  data.forEach((post, index) => {
    const trElement = createPostElement(post, index);
    postList.appendChild(trElement);
  });
}

// // ==================
function initPriceChange({ onChange }) {
  const slider = document.querySelector('#price #smooth-steps');
  const smoothStepsValues = document.querySelector('#price #smooth-steps-values');

  noUiSlider.create(slider, {
    start: [0, 15],
    // behaviour: 'smooth-steps',
    step: 0.5,
    connect: true,
    range: {
      min: 0,
      max: 15,
    },
  });

  slider.noUiSlider.on('update', function (values) {
    const number1 = parseFloat(values[0]);
    const number2 = parseFloat(values[1]);
    smoothStepsValues.textContent = `Từ ${number1} - ${number2} triệu đồng`;
  });

  const priceButtonWrapper = document.getElementById('price-buttons');
  const buttons = priceButtonWrapper.querySelectorAll('button');
  // set value and get value
  priceButtonWrapper.addEventListener(
    'click',
    function (e) {
      if (e.target.tagName === 'BUTTON') {
        console.log(e.target.tagName);
        const value = e.target.value.split('-');
        slider.noUiSlider.set(value);
        onChange?.(slider.noUiSlider.get());
        for (const button of buttons) button.classList.toggle('active', e.target === button);
      }
    },
    {
      capture: true,
    }
  );
}
function initAcreageChange({ onChange }) {
  const slider = document.querySelector('#acreage #smooth-steps');
  const smoothStepsValues = document.querySelector('#acreage #smooth-steps-values');

  noUiSlider.create(slider, {
    start: [0, 90],
    // behaviour: 'smooth-steps',
    step: 5,
    connect: true,
    range: {
      min: 0,
      max: 90,
    },
  });

  slider.noUiSlider.on('update', function (values) {
    const number1 = parseFloat(values[0]);
    const number2 = parseFloat(values[1]);
    smoothStepsValues.textContent = `Từ ${number1} - ${number2} m2`;
  });

  const acreageButtonWrapper = document.getElementById('acreage-buttons');
  const buttons = acreageButtonWrapper.querySelectorAll('button');

  // set value and get value
  acreageButtonWrapper.addEventListener(
    'click',
    function (e) {
      if (e.target.tagName === 'BUTTON') {
        console.log(e.target.tagName);
        const value = e.target.value.split('-');
        slider.noUiSlider.set(value);
        // get value change
        onChange?.(slider.noUiSlider.get());
        for (const button of buttons) button.classList.toggle('active', e.target === button);

        // change thì gọi lại
      }
    },
    {
      capture: true,
    }
  );
}

// set lại values
function handelChangeAcreage(defaultValues, values) {
  defaultValues.minAcreage = values[0].split('.')[0];
  defaultValues.maxAcreage = values[1].split('.')[0];
}
function handelChangePrice(defaultValues, values) {
  defaultValues.minPrice = values[0].split('.')[0] + '00000';
  defaultValues.maxPrice = values[1].split('.')[0] + '00000';
  if (defaultValues.minPrice === defaultValues.maxPrice) defaultValues.minPrice = '0';
}
function handelChangeAddress(defaultValues, values) {}

function initAddressChange({ onChange }) {
  // handel click categoryButton

  const provinceWrapper = document.getElementById('province-wrapper');
  provinceWrapper.addEventListener('click', (e) => {
    const liElement = e.target.closest('li');
    // liElement.data
    console.log('click me li', liElement);
  });
}
// // Main
(async () => {
  try {
    // code mói
    const defaultValues = {
      address: '',
      minPrice: '',
      maxPrice: '',
      minAcreage: '',
      maxAcreage: '',
    };
    initAddressChange({
      onChange: (value) => handelChangeAddress(defaultValues, value),
    });
    initAcreageChange({
      onChange: (value) => handelChangeAcreage(defaultValues, value),
    });
    initPriceChange({ onChange: (value) => handelChangePrice(defaultValues, value) });
    initRemovePost();
    handelFilterChange({});

    // input ranger
  } catch (error) {
    console.log(error);
  }
})();
// console.log('admin');
