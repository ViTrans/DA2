import postApi from './api/postApi.js';

async function handelFilterChange(filterName, filterValue) {
  const queryPamrams = new URL(window.location);
  if (filterName) queryPamrams.searchParams.set(filterName, filterValue);

  if (filterName === 'title' || filterName === 'category') queryPamrams.searchParams.delete('page');
  if (filterName === 'title' && filterValue == '') queryPamrams.searchParams.delete('title');
  if (filterName === 'category' && filterValue == '') queryPamrams.searchParams.delete('category');
  history.pushState({}, '', queryPamrams);

  // call api
  const { data, pagination } = await postApi.getAllByUserId(queryPamrams.searchParams);

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
      handelFilterChange('page', page);
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
function createPostElement(post, index) {
  const postTemplate = document.getElementById('postTemplate').cloneNode(true).content;
  const trElement = postTemplate.firstElementChild;
  let ordinalNumber = index + 1;
  if (!trElement || !post) return;
  const title = trElement.querySelector('[data-id="title"]');
  if (!title) return;
  title.textContent = post?.title;

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

  const editButton = trElement.querySelector('#edit-btn');
  const removeButton = trElement.querySelector('#remove-btn');

  editButton.addEventListener('click', (e) => {
    window.location.assign(`http://localhost:5000/posts/add-edit?id=${post._id}`);
  });
  removeButton.addEventListener('click', () => {
    const trElement = removeButton.closest('tr');

    if (!trElement) return;
    console.log('okkk');
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
// Main
(async () => {
  try {
    initRemovePost();
    handelFilterChange();
  } catch (error) {
    console.log(error);
  }
})();
