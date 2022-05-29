var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET user. */
router.post('/username', function(req, res, next) {
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

/* GET user, update password. */
router.post('/updatePassword', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {

    if (err) {
      res.sendStatus(500);
      return;
    }

    var query = "SELECT user_id FROM User WHERE username = ? AND password = ?";
    connection.query(query, [req.body.username, req.body.currentPass], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {

        res.sendStatus(500);
        return;
      }
      console.log("check");
      var query = "UPDATE User SET password = ? WHERE user_id = ?";
      connection.query(query, [req.body.newPass, rows.user_id], function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          res.sendStatus(500);
          return;
        }
      });

      res.json(rows); //send response
    });
  });
})

module.exports = router;
