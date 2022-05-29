var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET user. */
router.get('/getUser', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "SELECT first_name, last_name FROM actor";
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

module.exports = router;
