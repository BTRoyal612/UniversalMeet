function getUser() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
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
        }
    };

    xhttp.open("GET", "/admin", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
          let user = JSON.parse(this.responseText)[0];
          if (user.isAdmin) {
            getAdmin();
            window.location = '/admin/admin-user';
          } else {
            getUser();
            window.location = '/users/profile';
          }
        }else if(this.readyState == 4 && this.status >= 400){
          alert("Login Failed! Username or Email incorrect.");
        }
    };

    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ email:email , password:password }));
}

function signup() {
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
            window.location = '/admin/admin-user';
          } else {
            getUser();
            window.location = '/users/profile';
          }
      }
  };

  xhttp.open("POST", "/signup", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ username:username , password:password , email:email}));
};

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
              getUser();
              window.location = '/users/profile';
            }
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
            });
        }// else if(this.readyState == 4 && this.status >= 400){
        //   alert("Login Failed! Google login incorrect.");
        // }
    };

    var id_token = googleUser.getAuthResponse().id_token;  //Token from Google side

    //I dont know if u guys want to do login like this. This is just a tmp mock one to show u guys how openID work

    xhttp.open("POST", "/googleLogin"); //An unique request for openID login
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
      token: id_token
    }));

    //So generally it will get a id token from Google side and send it to our server in JSON format. Just adjust anything here as we need.
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
            window.location = '/admin/admin-user'
          } else {
            getUser();
            window.location = '/users/profile'
          }
          var auth2 = gapi.auth2.getAuthInstance();
          auth2.signOut().then(function () {
          });
      }// else if(this.readyState == 4 && this.status >= 400){
      //   alert("Login Failed! Google login incorrect.");
      // }
  };

  var id_token = googleUser.getAuthResponse().id_token;  //Token from Google side

  //I dont know if u guys want to do login like this. This is just a tmp mock one to show u guys how openID work

  xhttp.open("POST", "/googleLogin"); //An unique request for openID login
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({
    token: id_token
  }));

  //So generally it will get a id token from Google side and send it to our server in JSON format. Just adjust anything here as we need.
}
