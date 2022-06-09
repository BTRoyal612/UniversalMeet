function updateEmailPreference() {
  console.log("button press");
  let user_respond = document.getElementById("user_respond").checked;
  let event_finalize = document.getElementById("event_finalize").checked;
  let event_cancel = document.getElementById("event_cancel").checked;

  console.log(user_respond);
  console.log(event_finalize);
  console.log(event_cancel);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        alert("Notification preference has been updated!!!")
      }
  }

  xhttp.open("POST", "/users/updateEmailPreference", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ user_respond:user_respond, user_join:false, event_finalize:event_finalize, event_cancel:event_cancel}));
};