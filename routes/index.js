var express = require('express');
var router = express.Router();

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('110103062531-ujd4r0sb2khv4rueml1fuunk2f5roddc.apps.googleusercontent.com');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});
/* POST login. */
router.post('/login', function(req, res, next) {
  if ('username' in req.body && 'password' in req.body) {
    // Connect to the database
    req.pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      var query = "CALL login(?, ?)";
      connection.query(query, [req.body.username, req.body.password], function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }

        if (rows.length > 0) {
          req.session.user = rows[0];
          console.log('login success');
          console.log(req.session.user);
          res.json(rows[0]); //send response
        } else {
          console.log('login bad');
          res.sendStatus(401);
        }
      });
    });
  }
})


router.post('/googleLogin', function(req, res, next) {

  if ('token' in req.body) {

    let email = null;
    let username = null;

    async function verify() {
      const ticket = await client.verifyIdToken({
          idToken: req.body.token,
          audience: '110103062531-ujd4r0sb2khv4rueml1fuunk2f5roddc.apps.googleusercontent.com',
          // Specify the CLIENT_ID of the app that access the backend. If multiple clients access the backend: [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      console.log(userid);
      email = payload['email'];
      username = payload['name'];
      // If request specified a G Suite domain: const domain = payload['hd'];
    }
    verify().then(function(){}).catch(function(){
      res.sendStatus(403);
    });

    // Connect to the database
    req.pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      var query = "CALL google_login(?, ?)";
      connection.query(query, [username, email], function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }

        if (rows.length > 0) {
          req.session.user = rows[0];
          console.log('login success');
          console.log(req.session.user);
          res.json(rows[0]); //send response
        } else {
          console.log('login bad');
          res.sendStatus(401);
        }
      });
    });
  }



  //Codes below are from https://developers.google.com/identity/sign-in/web/backend-auth
  // var xhr = new XMLHttpRequest();
  // xhr.open('POST', 'https://yourbackend.example.com/tokensignin');
  // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // xhr.onload = function() {
  //   console.log('Signed in as: ' + xhr.responseText);
  // };
  // xhr.send('idtoken=' + id_token);

})


/* POST sign up. */
router.post('/signup', function(req, res, next) {
  if ('username' in req.body && 'password' in req.body) {
    // Connect to the database
    req.pool.getConnection(function(err, connection) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      var query = "CALL sign_up(?, ?, ?)";
      connection.query(query, [req.body.username, req.body.email, req.body.password], function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        if (rows.length > 0) {
          req.session.user = rows[0];
          console.log('login success');
          console.log(req.session.user);
          res.json(rows[0]); //send response
        } else {
          console.log('login bad');
          res.sendStatus(401);
        }
      });
    });
  }
})

/* GET logout. */
router.get('/logout', function(req, res, next) {
  if ('user' in req.session) {
    delete req.session.user;
  }
  res.end();
})

router.get('/home', function(req, res) {
  res.render('home')
})

// GET invitation link
router.get('/invitation/:id', function(req, res, next) {
  let deserializedID = deserialize(req.params.id); 
  res.redirect('/invitation/' + deserializedID);
});

// var nodemailer = require("nodemailer");
// let transporter = nodemailer.createTransport({
//   host: "gmail",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: "meet.universal@gmail.com", // generated ethereal user
//     pass: "Finalproject1", // generated ethereal password
//   },
// });

// // send mail with defined transport object
// let info = await transporter.sendMail({
//   from: '"Fred Foo 👻" <foo@example.com>', // sender address
//   to: "bar@example.com, baz@example.com", // list of receivers
//   subject: "Hello ✔", // Subject line
//   text: "Hello world?", // plain text body
//   html: "<b>Hello world?</b>", // html body
// });
module.exports = router;

