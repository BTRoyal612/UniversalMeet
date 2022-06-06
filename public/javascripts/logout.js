function logout() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // mGoogleSignInClient.signOut()
            // .addOnCompleteListener(this, new OnCompleteListener<Void>() {
            //     @Override
            //     public void onComplete(@NonNull Task<Void> task) {
            //         // ...
            //     }
            // });
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
            window.location = './login.html';
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
            window.location = './login.html';
        }
    }

    xhttp.open("GET", "/admin/logout", true);
    xhttp.send();
}