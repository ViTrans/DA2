$(document).ready(function () {
  $.ajax({
    url: 'http://localhost:5000/api/v1/statistics',
    type: 'GET',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('token', `Bearer ${localStorage.getItem('token')}`);
    },
    success: function (result) {
      $('#total-user').html(result.countUser);
      $('#total-post').html(result.countPost);
      $('#total-category').html(result.countCategory);
      $('#total-vip1').html(result.countVip1);
      $('#total-vip2').html(result.countVip2);
      $('#total-vip3').html(result.countVip3);
    },
    error: function (err) {},
  });
});
