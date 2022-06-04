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

function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          getUser();
          window.location = './profile.html'
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
          getUser();
          window.location = './profile.html'
        }
    }

    xhttp.open("POST", "/signup", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ username:username , password:password , email:email}));
};

