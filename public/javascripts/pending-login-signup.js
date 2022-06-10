var event_id;
function getSerial(serial) {
    event_id = serial;
}

function getUser(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          joinEvent(id);
        }
    };

    xhttp.open("GET", "/users", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function getAdmin() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          window.location = '/admin/admin-user';
        }
    };

    xhttp.open("GET", "/admin", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function serialize(id) {
    let res = "";
    while (id != 0) {
      let remainder = id % 26;
      id = Math.floor(id / 26);
      res = res + String.fromCharCode(remainder + 97);
    }
    while (res.length < 6) {
      res = res + 'a';
    }
    return res.split("").reverse().join("");
}

function pending_login(id) {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
          let user = JSON.parse(this.responseText)[0];
          if (user.isAdmin) {
            getAdmin();
          } else {
            getUser(id);
          }
        } else if (this.readyState == 4 && this.status >= 400){
          alert("Login Failed! Username or Email incorrect.");
        }

    };

    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ email:email , password:password }));
}

function pending_signup(id) {
  let notice = document.getElementById('notice');
  let password = document.getElementById('password').value;
  let confirmedPassword = document.getElementById('confirmPassword').value;

  if (password != confirmedPassword) {
    notice.innerHTML = "Please reenter password!";
    notice.removeAttribute("hidden");
    return;
  }

  let username = document.getElementById('username').value;
  if (username.length < 8) {
    notice.innerHTML = "Username need at least 8 characters.";
    notice.removeAttribute("hidden");
    return;
  }

  let email = document.getElementById('email').value;
  const email_required = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email.match(email_required)) {
    notice.innerHTML = "Please enter a valid email.";
    notice.removeAttribute("hidden");
    return;
  }

  const pass_required = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  if (!password.match(pass_required)) {
    notice.innerHTML = "Password must be between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character";
    notice.removeAttribute("hidden");
    return;
  }

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          let user = JSON.parse(this.responseText)[0];
          if (user.isAdmin) {
            getAdmin();
          } else {
            getUser(id);
          }
      }
  };

  xhttp.open("POST", "/signup", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ username:username , password:password , email:email}));
}


function onSignIn(googleUser) {
    //So guys extract anything you need from 'profile', just like what I shown below
    var profile = googleUser.getBasicProfile();

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            let user = JSON.parse(this.responseText)[0];
            if (user.isAdmin) {
              getAdmin();
              window.location = '/admin/admin-user';
            } else {
              getUser(event_id);
            }
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
            });
        }
    };

    var id_token = googleUser.getAuthResponse().id_token;  //Token from Google side

    xhttp.open("POST", "/googleLogin"); //An unique request for openID login
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ token: id_token }));
}

// Let user join event
function joinEvent(id) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location = '/users/invite-response/'+serialize(id);
    }
  };

  xhttp.open("POST", "/users/joinEvent", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ event_id: id }));
}