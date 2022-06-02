var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
          res.json(rows); //send response
        } else {
          console.log('login bad');
          res.sendStatus(401);
        }
      });
    });
  }
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
        res.send(); //send response
      });
    });
  }
})

/* POST login. */
router.post('/logout', function(req, res, next) {
  if ('user' in req.session) {
    delete req.session.user;
  }
  res.end();
})

router.get('/admin-user.html', function(req, res, next) {
  res.send('boocu');
})

module.exports = router;
