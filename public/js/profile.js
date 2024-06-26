// get profile localhost:5000/api/v1/profile
// jquery

$(document).ready(function () {
  // get profile
  $.ajax({
    url: 'http://localhost:5000/api/v1/profile',
    type: 'GET',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('token', `Bearer ${localStorage.getItem('token')}`);
    },
    success: function (result) {
      $('#name').val(result.username);
      $('#email').val(result.email);
      $('#phone').val(result.phone);

      $('#img-avatar').attr('src', result.avatar);
    },
    error: function (err) {},
  });
});

// update profile
$('#btn-update-profile').click(function (e) {
  e.preventDefault();
  const name = $('#name').val();
  const email = $('#email').val();
  const phone = $('#phone').val();
  const file = $('#file')[0].files[0];

  // Khởi tạo đối tượng FormData
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('file', file);

  $.ajax({
    url: 'http://localhost:5000/api/v1/profile',
    type: 'PUT',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('token', `Bearer ${localStorage.getItem('token')}`);
    },
    data: formData, // Sử dụng đối tượng FormData
    processData: false,
    contentType: false,
    success: function (result) {
      // $('#img-avatar').attr('src', result.avatar);
      console.log('rres ', result);
      alert(result.message);
      localStorage.setItem('user', JSON.stringify(result.data));
    },
    error: function (err) {},
  });
});

// change password
$('#btn-change-password').click(function (e) {
  e.preventDefault();
  const oldPassword = $('#old-password').val();
  const newPassword = $('#new-password').val();
  $.ajax({
    url: 'http://localhost:5000/api/v1/profile/change-password',
    type: 'PUT',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('token', `Bearer ${localStorage.getItem('token')}`);
    },
    data: {
      oldPassword,
      newPassword,
    },
    success: function (result) {
      if (result.message) {
        alert(result.message);
        // clear input
        $('#old-password').val('');
        $('#new-password').val('');
      }
    },
    error: function (err) {
      alert(err.responseJSON.message);
    },
  });
});
