var express = require('express');
var router = express.Router();

/* POST add admin. */
router.post('/addAdmin', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "INSERT INTO User (username, password, isAdmin) VALUES (?, ?, true)";
    connection.query(query, [req.body.username, req.body.password], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(); //send response
    });
  });
})

/* POST get user list admin. */
router.post('/getUserList', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "SELECT * FROM User";
    connection.query(query, function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
})

/* POST delete user admin. */
router.post('/deleteUser', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
        return;
      }
      var query = "DELETE FROM User WHERE user_id = ?";
      connection.query(query, [req.body.user_id], function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          res.sendStatus(500);
          return;
        }
        res.send(); //send response
      });
    });
  })


module.exports = router;