var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET user. */
router.get('/username', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "SELECT user_id FROM User WHERE username = ? AND password = ?";
    connection.query(query, [req.body.username, req.body.password], function(err, rows, fields) {
    connection.release(); // release connection
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.json(rows); //send response
    });
  });
})

/* GET user. */
router.get('/updatePassword', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE User SET password = ? WHERE username = ? AND password = ?";
    connection.query(query, [req.body.currentPass, req.body.username, req.body.newpassword], function(err, rows, fields) {
    connection.release(); // release connection
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.json(rows); //send response
    });
  });
})

module.exports = router;
