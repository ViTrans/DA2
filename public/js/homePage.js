$(document).ready(function () {
  function renderPosts(data) {
    const posts = data.post;
    const html = posts
      .map((post) => {
        return `
            <div class="row bg-white rounded-3 p-3 mt-2">
              <div class="col-md-4">
                <img
                  src="${post.images[0]}"
                  class="card-img-top rounded-3"
                  style="height: 200px; object-fit: cover;"
                  alt="..."
                />
              </div>
              <div class="col-md-8">
                <a
                  href="/details/${post._id}"
                  class="card-title text-capitalize text-decoration-none fs-5 text-primary mt-2"
                  >${post.title}</a
                >
                <div class="card-rate">
                
                  ${
                    // nếu vip3 thì hiển thị 5 sao đỏ
                    // nếu vip2 thì hiển thị 4 sao cam
                    // nếu vip1 thì hiển thị 3 sao vàng

                    post.isvip === "vip3"
                      ? `
                      <div class="text-danger">
                        <i class="fa fas fa-star"></i>
                        <i class="fa fas fa-star"></i>
                        <i class="fa fas fa-star"></i>
                        <i class="fa fas fa-star"></i>
                        <i class="fa fas fa-star"></i>
                      </div>
                        `
                      : post.isvip === "vip2"
                      ? `
                      <div style="color: #FF8B13;">
                      <i class="fa fas fa-star"></i>
                        <i class="fa fas fa-star"></i>
                        <i class="fa fas fa-star"></i>
                        <i class="fa fas fa-star"></i>
                        </div>`
                      : post.isvip === "vip1"
                      ? `
                      <div class="text-warning">
                      <i class="fa fas fa-star"></i>
                        <i class="fa fas fa-star"></i>
                        <i class="fa fas fa-star"></i>
                        </div>`
                      : ""
                  }
                </div>
                <p class="text-muted">${post.address}</p>
                <p class="card-price text-success">
                  ${post.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}<span>/Tháng</span>
                </p>
                <p class="card-text text-muted">
                  ${post.description}
                </p>
                <a href="#" class="btn btn-success">${post.phone}</a>
                <a href="#" class="btn btn-primary">Zalo</a>
              </div>
            </div>
          `;
      })
      .join("");
    $(".post-list").html(html);
  }

  function renderPagination(data) {
    const totalPage = data.totalPage;
    const currentPage = data.currentPage;
    const hasNextPage = data.hasNextPage;
    const hasPreviousPage = data.hasPreviousPage;
    const nextPage = data.nextPage;
    const previousPage = data.previousPage;
    const limit = data.limit;
    let htmlPage = "";
    // check active page
    if (hasPreviousPage) {
      htmlPage += `
          <li class="page-item">
            <a class="page-link" href="/?page=${previousPage}&limit=${limit}">Previous</a>
          </li>
        `;
    }
    let i = 1;
    while (i <= totalPage) {
      if (i === currentPage) {
        htmlPage += `
              <li class="page-item active" aria-current="page">
                <a class="page-link" href="getPosts/?page=${i}&limit=${limit}">${i}</a>
              </li>
            `;
      } else {
        htmlPage += `
              <li class="page-item">
                <a class="page-link" href="getPosts/?page=${i}&limit=${limit}">${i}</a>
              </li>
            `;
      }
      i++;
    }
    if (hasNextPage) {
      htmlPage += `
          <li class="page-item">
            <a class="page-link" href="getPosts/?page=${nextPage}&limit=${limit}">Next</a>
          </li>
        `;
    }
    $(".pagination").html(htmlPage);
  }

  function getPosts(page, limit) {
    $.ajax({
      url: `/getPosts?page=${page}&limit=${limit}`,
      method: "GET",
      success: function (data) {
        renderPosts(data);
        renderPagination(data);
      },
      error: function (error) {
        console.log(error);
      },
    });
  }
  // lấy page từ url
  const urlParams = new URLSearchParams(window.location.search);

  const page = urlParams.get("page");
  const limit = urlParams.get("limit");

  if (!page || !limit) {
    getPosts(1, 4);
  } else {
    getPosts(page, limit);
  }

  // pagination
  $(document).on("click", ".pagination a", function (e) {
    e.preventDefault();
    const page = $(this).attr("href").split("=")[1].split("&")[0];
    const limit = $(this).attr("href").split("=")[2];
    getPosts(page, limit);
    history.pushState(null, null, `/?page=${page}&limit=${limit}`);
  });
});