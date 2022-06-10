$(document).ready(function () {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let preference = JSON.parse(this.responseText)[0];
      document.getElementById("user_respond").checked = preference['user_respond'];
      document.getElementById("user_join").checked = preference['user_join'];
      document.getElementById("event_finalize").checked = preference['event_finalize'];
      document.getElementById("event_cancel").checked = preference['event_cancel'];
    }
  }

  xhttp.open("POST", "/users/getEmailPreference", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
});

function updateEmailPreference() {
  console.log("button press");
  let user_respond = document.getElementById("user_respond").checked;
  let user_join = document.getElementById("user_join").checked;
  let event_finalize = document.getElementById("event_finalize").checked;
  let event_cancel = document.getElementById("event_cancel").checked;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        alert("Notification preference has been updated!!!")
      }
  }

  xhttp.open("POST", "/users/updateEmailPreference", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ user_respond:user_respond, user_join:user_join, event_finalize:event_finalize, event_cancel:event_cancel}));
};