function onSignIn(googleUser) {
    console.log('openID test');  //It show up means this function successfully be called

    //So guys extract anything you need from 'profile', just like what I shown below
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to backend directly. Use ID token
    console.log('Name: ' + profile.getName()); //It's not definitely English
    console.log('Image URL: ' + profile.getImageUrl()); //Probably we dont need that
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present

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

