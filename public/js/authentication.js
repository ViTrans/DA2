import userApi from './api/userApi.js';

function renderUserInfo({ sidebar, user }) {
  const userInfo = sidebar.querySelector('.user_info');
  console.log(userInfo);
  const avatar = userInfo.querySelector('.user_avatar > img');
  const phone = userInfo.querySelector('.phone');
  const username = userInfo.querySelector('.username > b');
  username.textContent = user.username;
  phone.textContent = user.phone;
  avatar.src = user.avatar;
  // code user
  // monney
  // ......
}
function renderPermisison({ sidebar, user }) {
  const navbarContainer = sidebar.querySelector('#navbar');
  const navbarTemplate = document.querySelector('#navbarTemplate').cloneNode(true).content;

  // render chung admin vs user
  // const navItemMyPosts = navbarTemplate.querySelector('#navItemMyPosts');
  // const navItemEditProfile = navbarTemplate.querySelector('#navItemEditProfile');
  // const navItemTopUp = navbarTemplate.querySelector('#navItemEditProfile');
  // const navItemTopUpHistory = navbarTemplate.querySelector('#navItemTopUpHistory');
  // const navItemPaymentHistory = navbarTemplate.querySelector('#navItemPaymentHistory');
  // const navItemPackageManagement = navbarTemplate.querySelector('#navItemPackageManagement');
  // const navItemStatistics = navbarTemplate.querySelector('#navItemStatistics');
  // const navItemPriceList = navbarTemplate.querySelector('#navItemPriceList');
  // const navItemLogout = navbarTemplate.querySelector('#navItemLogout');
  // const navItemContact = navbarTemplate.querySelector('#navItemContact');

  const basicRole = [
    'navItemMyPosts',
    'navItemEditProfile',
    'navItemTopUpHistory',
    'navItemPaymentHistory',
    'navItemPriceList',
    'navItemLogout',
    'navItemContact',
  ];

  const roleAdmin = [
    'navItemStatistics',
    'navItemPackageManagement',
    'navItemCategories',
    'navItemPostManagement',
    'navItemUserManagement',
  ];

  basicRole.forEach((elmentId) => {
    const element = navbarTemplate.querySelector(`#${elmentId}`);
    if (!element) return;
    navbarContainer.appendChild(element);
  });

  if (user.role === 'admin') {
    roleAdmin.forEach((elmentId) => {
      const element = navbarTemplate.querySelector(`#${elmentId}`);
      if (!element) return;
      navbarContainer.appendChild(element);
    });
  }

  // admin có thống kê
  // admin có thêm quản lí  all  post của tất cả user
  // admin có thêm quản lí  all user
  // admin có all dịch dịch hẹ thống
  // admin có thêm sửa xóa gói tin
  // ...
}

// /api/v1/auth
(async () => {
  try {
    console.log('xác thực user with token');
    const token = sessionStorage.getItem('token');
    if (!token) window.location.assign('http://localhost:5000/404');

    // check role
    // render sidebar menu theo Role
    const { user } = await userApi.getCurentUser();

    console.log('Trang web đã tải hoàn tất!');
    console.log('render ui sidebar');
    const sidebar = document.querySelector('#sidebar');
    renderUserInfo({
      sidebar,
      user,
    });
    renderPermisison({
      sidebar,
      user,
    });

    // renderPermisison();
  } catch (error) {
    console.log('ko có token');
    console.log(error);
    // window.location.assign('http://localhost:5000/404');
  }
})();
