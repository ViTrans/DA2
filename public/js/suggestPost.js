import postApi from './api/postApi.js';

function searchRooms() {
  // Lấy vị trí hiện tại của người dùng bằng API Geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert('Trình duyệt không hỗ trợ Geolocation.');
  }
}

function convertMeterToKilometer(meter, decimalDigits = 2) {
  const kilometer = meter / 1000;
  return kilometer.toFixed(decimalDigits);
}

async function showPosition(position) {
  console.log(position);
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  const data = await postApi.suggest({ latitude, longitude });
  const postSuggestElement = document.getElementById('post-suggest');
  let postHtml = '<div class="bg-white p-3"><h3 class="fs-5 mb-2">Gần khu vựa bạn</h3>';
  data.map((post) => {
    let postVip = '';

    if (post.isvip === 'vip3') {
      postVip += `
      <span class="text-danger">
        <i class="fa fas fa-star"></i>
        <i class="fa fas fa-star"></i>
        <i class="fa fas fa-star"></i>
        <i class="fa fas fa-star"></i>
        <i class="fa fas fa-star"></i>
      </span>
    `;
    } else if (post.isvip === 'vip2') {
      postVip += `
      <span style="color: #ff8b13">
        <i class="fa fas fa-star"></i>
        <i class="fa fas fa-star"></i>
        <i class="fa fas fa-star"></i>
        <i class="fa fas fa-star"></i>
      </span>
    `;
    } else if (post.isvip === 'vip1') {
      postVip += `
      <span class="text-warning">
        <i class="fa fas fa-star"></i>
        <i class="fa fas fa-star"></i>
        <i class="fa fas fa-star"></i>
      </span>
    `;
    }

    postHtml += `
    <div  class="row justify-content-center">
    <div class="col-md-4 card-top">
      <img src="${post.images[0]}" class="img-post" style="object-fit: cover" alt="">
    </div>

    <a href="/details/${
      post._id
    }" class="col-md-8 card-title text-primary fs-6  text-decoration-none mb-2">
     ${postVip}  ${post.title}

      <p class="card-price text-success fs-6 fw-bold m-0">
      ${post.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
      <span>/Tháng</span>
    </p>
    <span>cách bạn ${convertMeterToKilometer(post.distance)} km</span>
    </a>
   </div>
  `;
  });
  postSuggestElement.innerHTML += postHtml;
}

// Main
(async () => {
  try {
    searchRooms();

    // input ranger
  } catch (error) {}
})();
