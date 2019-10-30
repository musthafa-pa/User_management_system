var userListData = [];

$(document).ready(function(){
    populateTable();
    // Username link click
    // Add User button click
  $('#btnAddUser').on('click', addUser);
$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
});

function populateTable(){
    var tableContent = '';
    $.getJSON('/users/', function(data){
        $.each(data, function(){
            userListData = data;
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        $('#userList table tbody').html(tableContent);
    });
}

function showUserInfo(){
    event.preventDefault();
    var thisUsername = $(this).attr('rel');
    var arrayPosition = userListData.map(function(arrayItem){
        return arrayItem.username;
    }).indexOf(thisUsername);

    var thisUserObject = userListData[arrayPosition];

  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);
}

// Add User
function addUser(event) {
    event.preventDefault();
  
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
      if($(this).val() === '') { errorCount++; }
    });
  
    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
  
      // If it is, compile all user info into one object
      var newUser = {
        'username': $('#addUser fieldset input#inputUserName').val(),
        'email': $('#addUser fieldset input#inputUserEmail').val(),
        'fullname': $('#addUser fieldset input#inputUserFullname').val(),
        'age': $('#addUser fieldset input#inputUserAge').val(),
        'location': $('#addUser fieldset input#inputUserLocation').val(),
        'gender': $('#addUser fieldset input#inputUserGender').val()
      }
  
      // Use AJAX to post the object to our adduser service
      $.ajax({
        type: 'POST',
        data: newUser,
        url: '/users/adduser',
        dataType: 'JSON'
      }).done(function( response ) {
  
        // Check for successful (blank) response
        if (response.msg === '') {
  
          // Clear the form inputs
          $('#addUser fieldset input').val('');
  
          // Update the table
          populateTable();
  
        }
        else {
  
          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.msg);
  
        }
      });
    }
    else {
      // If errorCount is more than 0, error out
      alert('Please fill in all fields');
      return false;
    }
  };