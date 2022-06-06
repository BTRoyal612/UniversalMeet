function logout() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        }
    }

    xhttp.open("GET", "/logout", true);
    xhttp.send();
}

function userLogout() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            logout();
            window.location = '/home';
        }
    }

    xhttp.open("GET", "/users/logout", true);
    xhttp.send();
}

function adminLogout() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            logout();
            window.location = '/home';
        }
    }

    xhttp.open("GET", "/admin/logout", true);
    xhttp.send();
}