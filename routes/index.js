var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('110103062531-ujd4r0sb2khv4rueml1fuunk2f5roddc.apps.googleusercontent.com');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});

/* POST login. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/pending-login', function(req, res, next) {
  let serial = req.body.serial;
  res.render('pending-login', {serial: serial});
});

router.post('/login', function(req, res, next) {
  if ('email' in req.body && 'password' in req.body) {
    // Connect to the database
    req.pool.getConnection(function(err, connection) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      var query = "CALL login(?, ?)";
      connection.query(query, [req.body.email, req.body.password], function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          res.sendStatus(500);
          return;
        }

        if (rows[0].length > 0) {
          req.session.user = rows[0];
          res.json(rows[0]); //send response
        } else {
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
      username = payload['name'];
      email = payload['email'];
      // If request specified a G Suite domain: const domain = payload['hd'];
    }
    verify().then(function(){}).catch(function(){
      res.sendStatus(403);
    });

    // Connect to the database
    req.pool.getConnection(function(err, connection) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      var query = "CALL google_login(?, ?)";
      connection.query(query, [username, email], function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          res.sendStatus(501);
          return;
        }

        if (rows[0].length > 0) {
          req.session.user = rows[0];
          res.json(rows[0]); //send response
        } else {
          res.sendStatus(401);
        }
      });
    });
  }else{
    res.sendStatus(400);
  }
});

/* POST pending sign up. */
router.post('/pending-signup', function(req, res, next) {
  let serial = req.body.serial;
  res.render('pending-signup', {serial: serial});
});

/* POST sign up. */
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  if ('username' in req.body && 'email' in req.body && 'password' in req.body) {
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
          res.sendStatus(500);
          return;
        }
        if (rows[0].length > 0) {
          req.session.user = rows[0];
          res.json(rows[0]); //send response
        } else {
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

/* POST send email. */
function sendEmail(subject, body, user) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "meet.universal@gmail.com", // generated ethereal user
      pass: "ddbhooarlbmejpwc", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: 'meet.universal@gmail.com', // sender address
    to: user, // list of receivers
    subject: subject, // Subject line
    html: body, // html body
  });
}

router.post('/sendEmail', function(req, res, next) {
  sendEmail(req.body.subject, req.body.body, req.body.user);
  res.send('send email');
});

module.exports = router;