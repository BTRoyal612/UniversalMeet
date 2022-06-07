var express = require('express');
var router = express.Router();

/* GET admin listing. */
var admin;
router.get('/', function(req, res, next) {
  console.log(req.session);
  if (req.session.user[0].isAdmin) {
    admin = req.session.user;
  }
  console.log(admin);
  res.send('respond with a resource');
});

/* GET admin logout. */
router.get('/logout', function(req, res, next) {
  admin = null;
  res.send('respond with a resource');
});

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
  //Determinate if this user isAdmin or not first

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

/* POST get user. */
router.post('/getUser', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "SELECT * FROM User WHERE WHERE user_id = ?";
    connection.query(query, [req.body.user_id], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
})

/* POST add user. */
router.post('/addUser', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "INSERT INTO User (username, password) VALUES (?, ?)";
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

/* POST get event list admin. */
router.post('/getEventList', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "SELECT * FROM Event";
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

/* POST add event. */
router.post('/addEvent', function(req, res, next) {
  // Connect to the database
  console.log(req.body);
  req.pool.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      res.sendStatus(500);
      return;
    }
    var query = "CALL create_event (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query, [req.body.creator_id, req.body.event_name, req.body.date, req.body.duration, req.body.time_zone, req.body.hold_location, req.body.due_date, req.body.note, req.body.share_link, req.body.isOnline], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        console.log(err)
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send respons
    });
  });
});

/* POST delete event. */
router.post('/deleteEvent', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "DELETE FROM Event WHERE event_id = ?";
    connection.query(query, [req.body.event_id],function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(); //send response
    });
  });
})

/* POST update event. */
router.post('/updateEvent', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE Event SET event_name = ?, duration = ?, time_zone = ?, hold_location = ?, due_date = ?, note = ?, share_link = ?, isOnline = ? WHERE event_id = ?";
    connection.query(query, [req.body.event_name, req.body.duration, req.body.time_zone, req.body.hold_location, req.body.due_date, req.body.note, req.body.share_link, req.body.isOnline, req.body.event_id], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(); //send response
    });
  });
})

/* POST update user email preference. */
router.post('/updateEmailPreference', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE Email_preference SET user_respond = ?, avail_confirm = ?, event_finalize = ?, event_cancel = ? WHERE user_id = ?";
    connection.query(query, [req.body.user_respond, req.body.avail_confirm, req.body.event_finalize, req.body.event_cancel, req.body.user_id], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(); //send response
    });
  });
})

router.post('/getAdminUser', function(req, res, next) {
  res.send('admin-user');
})

router.post('/getAdminEvent', function(req, res, next) {
  res.send('admin-event');
})

router.get('/admin-user', function(req, res, next) {
  res.render('admin-user');
})

router.get('/admin-event', function(req, res, next) {
  res.render('admin-event');
})


module.exports = router;