import postApi from './api/postApi.js';
import categoryApi from './api/categoryApi.js';
import { toast } from './toast.js';

// END UP API
function createPostElement(post) {
  const postTemplate = document.getElementById('postTemplate').cloneNode(true).content;
  const trElement = postTemplate.firstElementChild;

  if (!trElement || !post) return;
  const title = trElement.querySelector('[data-id="title"]');
  if (!title) return;
  title.textContent = post?.title;

  const category = trElement.querySelector('[data-id="category"]');
  if (!category) return;
  category.textContent = post?.categoryName;

  const image = trElement.querySelector('[data-id="image"]').firstElementChild;
  if (!image) return;
  image.src = post?.image;

  const editButton = trElement.querySelector('.edit-btn');
  const removeButton = trElement.querySelector('.delete-btn');

  editButton.addEventListener('click', () => {
    window.location.assign(`http://localhost:5001/admin/posts/add-edit?id=${post._id}`);
  });
  removeButton.addEventListener('click', () => {
    console.log('remove button clicked', post._id);
    const trElement = removeButton.closest('tr');
    if (!trElement) return;
    let event = new CustomEvent('removePost', {
      bubbles: true,
      detail: { elemntId: trElement, id: post._id },
    }); // (2)
    removeButton.dispatchEvent(event);
  });
  return trElement;
}

function renderPostList({ elemntId, data }) {
  const postList = document.getElementById(elemntId);
  if (!postList) return;
  postList.textContent = '';
  data.forEach((post) => {
    const trElement = createPostElement(post);
    postList.appendChild(trElement);
  });
}

function debounce(fn, delay) {
  let timer;
  return (() => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(), delay);
  })();
}
function initSearchInput({ formId, name, onChange }) {
  const postForm = document.getElementById(formId);
  if (!postForm) return;

  const searchInput = postForm.querySelector(`[name="${name}"]`);
  if (!searchInput) return;

  searchInput.addEventListener('input', (event) => {
    debounce(() => onChange?.(event.target.value), 2000);
  });
}

function initOnchageSelectBox({ formId, inputId, onChange }) {
  const postForm = document.getElementById(formId);
  if (!postForm) return;

  const selectInputElement = postForm.querySelector(`#${inputId}`);
  if (!selectInputElement) return;

  selectInputElement.addEventListener('change', (event) => {
    const element = event.target;
    const categoryId = element.options[element.selectedIndex].value;
    debounce(() => onChange?.(categoryId), 2000);
  });
}

function createOptionInput(category) {
  const inputElement = document.createElement('option');
  if (!inputElement || !category) return;

  inputElement.value = category._id;
  inputElement.textContent = category.name;
  return inputElement;
}
async function renderSelectBox({ elemntId }) {
  const selectBox = document.getElementById(elemntId);
  const { categories } = await categoryApi.getAll();
  //
  categories.forEach((category) => {
    const optionInput = createOptionInput(category);
    selectBox.appendChild(optionInput);
  });
}
async function handelFilterChange(filterName, filterValue) {
  const url = new URL(window.location);
  if (filterName) url.searchParams.set(filterName, filterValue);

  if (filterName === 'title' || filterName === 'category') url.searchParams.delete('page');
  if (filterName === 'title' && filterValue == '') url.searchParams.delete('title');
  if (filterName === 'category' && filterValue == '') url.searchParams.delete('category');
  history.pushState({}, '', url);

  // render post
  const { data, pagination } = await postApi.getAll(url.searchParams);
  renderPostList({
    elemntId: 'postList',
    data,
  });
  const { pageActive, paginationElement, prevPage, nextPage } = renderPagination({
    elemntId: 'pagination',
    pagination,
  });
  handelClickPage({
    pageActive,
    paginationElement,
    prevPage,
    nextPage,
    onChange: (page) => {
      handelFilterChange('page', page);
    },
  });
}
function handelClickPage({ pageActive, paginationElement, prevPage, nextPage, onChange }) {
  const totalPages = paginationElement.dataset.totalPages;
  const page = paginationElement.dataset.page;
  if (page < 2) prevPage.classList.add('disabled');
  if (page >= totalPages) nextPage.classList.add('disabled');

  prevPage.addEventListener('click', (e) => {
    e.preventDefault();

    // prevPage.classList.remove('disabled');
    const pageIndex = +page - 1;
    onChange?.(pageIndex);
  });
  nextPage.addEventListener('click', (e) => {
    e.preventDefault();

    // nextPage.classList.remove('disabled');
    const pageIndex = +page + 1;
    onChange?.(pageIndex);
  });

  const pageNumbers = paginationElement.querySelectorAll('a.page-number');
  pageNumbers.forEach((pageNumber, index) => {
    pageNumber.addEventListener('click', ({ target }) => {
      pageActive.classList.remove('active');
      const pageIndex = +target.textContent;
      pageNumber.classList.add('active');
      onChange?.(pageIndex);
    });
  });
}

function renderPagination({ elemntId, pagination }) {
  const paginationElement = document.getElementById(elemntId);
  if (!paginationElement) return;

  paginationElement.textContent = '';
  const prevPage = document.createElement('a');
  prevPage.innerHTML = '&laquo';
  prevPage.classList.add('prevButton');
  const nextPage = document.createElement('a');
  nextPage.innerHTML = '&raquo';
  nextPage.classList.add('nextButton');

  if (!prevPage || !nextPage) return;
  paginationElement.appendChild(prevPage);
  paginationElement.appendChild(nextPage);
  paginationElement.dataset.totalPages = pagination.totalPages;
  paginationElement.dataset.page = pagination.page;

  const currentPage = pagination.page;
  let pageActive = null;
  for (let page = 1; page <= pagination.totalPages; page++) {
    const pageNumber = document.createElement('a');
    pageNumber.classList.add('page-number');
    pageNumber.textContent = page;
    // active page
    if (currentPage == page) {
      pageActive = pageNumber;
      pageNumber.classList.add('active');
    }
    paginationElement.insertBefore(pageNumber, paginationElement.children[page]);
  }
  return {
    pageActive,
    paginationElement,
    prevPage,
    nextPage,
  };
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
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          await postApi.removeById(e.detail.id);
          trElement.remove();
          // await toast.fire({
          //   icon: 'success',
          //   title: 'delete post successfully',
          // });
          // await handelFilterChange();
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
(async () => {
  renderSelectBox({
    elemntId: 'category',
  });
  initOnchageSelectBox({
    formId: 'searchPostForm',
    inputId: 'category',
    onChange: async (value) => await handelFilterChange('category', value),
  });
  initSearchInput({
    formId: 'searchPostForm',
    name: 'title',
    onChange: async (value) => await handelFilterChange('title', value),
  });
  
  initRemovePost();
  handelFilterChange();
})();
