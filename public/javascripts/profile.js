EVENTS = [
  {
    date: "25 May",
    day_events:
      [
        {
          name: 'Web Project',
          from: '10:00',
          to: '11:00',
          url: ''
        },
        {
          name: 'Web Project',
          from: '10:00',
          to: '11:00',
          url: ''
        },
        {
          name: 'Web Project',
          from: '10:00',
          to: '11:00',
          url: ''
        },

      ]
  },
  {
    date: "26 May",
    day_events:
      [
        {
          name: 'Web Project',
          from: '10:00',
          to: '11:00',
          url: ''
        },
        {
          name: 'Web Project',
          from: '10:00',
          to: '11:00',
          url: ''
        },

      ]
  },
  {
    date: "27 May",
    day_events:
      [
        {
          name: 'Web Project',
          from: '10:00',
          to: '11:00',
          url: ''
        },
        {
          name: 'Web Project',
          from: '10:00',
          to: '11:00',
          url: ''
        },
        {
          name: 'Web a',
          from: '10:00',
          to: '11:00',
          url: ''
        },

      ]
  },
]

var vueinst = new Vue({
  el: "#app",
  data: {
    events: EVENTS,
  }
});

function updatePassword() {
  let new_password = document.getElementById("newPassword").value;
  document.getElementById("newPassword").value = '';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      }
  }

  xhttp.open("POST", "/users/updatePassword", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ new_password:new_password }));
}

function getEmail() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let current_password = this.responseText;
        console.log(current_password);
        document.getElementById("currentEmail").value = current_password;
      }
  }

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
  }

  xhttp.open("POST", "/users/updateEmail", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ new_email:new_email }));
}