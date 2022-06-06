function getUser() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        }
    }

    xhttp.open("GET", "/users", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
};

function getAdmin() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        }
    }

    xhttp.open("GET", "/admin", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
};

function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
          let user = JSON.parse(this.responseText)[0];
          if (user.isAdmin) {
            getAdmin();
            window.location = './admin-user.html';
          } else {
            getUser();
            window.location = './profile.html';
          }
        }else if(this.readyState == 4 && this.status >= 400){
          alert("Login Failed! Username or Email incorrect.");
        }

    }

    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ username:username , password:password }));
};

function signup() {
    let password = document.getElementById('password').value;
    let confirmedPassword = document.getElementById('password').value;

    if (password != confirmedPassword) {
        alert("Please reenter password!");
        return;
    }

    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let user = JSON.parse(this.responseText)[0];
            if (user.isAdmin) {
              getAdmin();
              window.location = './admin-user.html'
            } else {
              getUser();
              window.location = './profile.html'
            }
        }
    }

    xhttp.open("POST", "/signup", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ username:username , password:password , email:email}));
};

function onSignIn(googleUser) {
    console.log('openID test');  //It show up means this function successfully be called

    //So guys extract anything you need from 'profile', just like what I shown below
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to backend directly. Use ID token
    console.log('Name: ' + profile.getName()); //It's not definitely English
    console.log('Image URL: ' + profile.getImageUrl()); //Probably we dont need that
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if(this.readyState == 4 && this.status == 200){
            let user = JSON.parse(this.responseText)[0];
            if (user.isAdmin) {
              getAdmin();
              window.location = './admin-user.html'
            } else {
              getUser();
              window.location = './profile.html'
            }
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
              console.log('Google User disconnect.');
            });
        }// else if(this.readyState == 4 && this.status >= 400){
        //   alert("Login Failed! Google login incorrect.");
        // }
    };

    var id_token = googleUser.getAuthResponse().id_token;  //Token from Google side

    //I dont know if u guys want to do login like this. This is just a tmp mock one to show u guys how openID work

    xhttp.open("POST", "googleLogin/"); //An unique request for openID login
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
      token: id_token
    }));

    //So generally it will get a id token from Google side and send it to our server in JSON format. Just adjust anything here as we need.
}
