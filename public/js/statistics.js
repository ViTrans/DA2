$(document).ready(function () {
  $.ajax({
    url: 'http://localhost:5000/api/v1/statistics',
    type: 'GET',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('token', `Bearer ${sessionStorage.getItem('token')}`);
    },
    success: function (result) {
      console.log(result);
      $('#total-user').html(result.countUser);
      $('#total-post').html(result.countPost);
      $('#total-package').html(result.countPackage);
      $('#total-category').html(result.countCategory);
    },
    error: function (err) {
      console.log(err);
    },
  });
});
