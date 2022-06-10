function onSignIn(googleUser) {
    //So guys extract anything you need from 'profile', just like what I shown below
    var profile = googleUser.getBasicProfile();

    let xhttp = new XMLHttpRequest();

    // xtthp.onreadystatechange = function(){
    //   if(this.readyState == 4 && this.status == 200){
    //     alert("Login Success!");
    //   }else if(this.readyState == 4 && this.status >= 400){
    //     alert("Login Failed!");
    //   }
    // };

    var id_token = googleUser.getAuthResponse().id_token;  //Token from Google side

    //I dont know if u guys want to do login like this. This is just a tmp mock one to show u guys how openID work

    xhttp.open("POST", "/googleLogin"); //An unique request for openID login
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
      token: id_token //id_token is the var from line 19
    }));

    //So generally it will get a id token from Google side and send it to our server in JSON format. Just adjust anything here as we need.

  }

