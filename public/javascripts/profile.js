function updatePassword() {
  let new_password = document.getElementById("newPassword").value;
  document.getElementById("newPassword").value = '';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      }
  };

  xhttp.open("POST", "/users/updatePassword", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ new_password:new_password }));
}

function getEmail() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let current_password = this.responseText;
        document.getElementById("currentEmail").value = current_password;
      }
  };

  xhttp.open("GET", "/users/getEmail", true);
  xhttp.send();
}

function updateEmail() {
  let new_email = document.getElementById("newEmail").value;
  document.getElementById("newEmail").value = '';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      }
  };

  xhttp.open("POST", "/users/updateEmail", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ new_email:new_email }));
}