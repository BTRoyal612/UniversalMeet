var express = require('express');
var router = express.Router();

/* GET users listing. */
var user;
router.get('/', function(req, res, next) {

  user = req.session.user[0];
  console.log(user.user_id);
  res.send('respond with a resource');
});

/* POST update user session. */
router.post('/updateSession', function(req, res, next) {
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
      req.session.user = rows[0];
      res.json(rows); //send response
    });
  });
})

/* POST update password. */
router.post('/updatePassword', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE User SET password = ? WHERE user_id = ?";
    connection.query(query, [req.body.password, req.body.user_id], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(); //send response
    });
  });
})

/* POST get user event list. */
router.post('/getEventList', function(req, res, next) {
  console.log(user);
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "SELECT Event.event_id, event_name, creator_id, user_id FROM Event INNER JOIN Event_pending ON Event.event_id = Event_pending.event_id WHERE user_id = ?";
    connection.query(query, [user.user_id], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
})

/* POST get event. */
router.post('/getEvent', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "SELECT * from Event WHERE event_id = ?";
    connection.query(query, [req.body.event_id], function(err, rows, fields) {
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
var dateEvent;
router.post('/passDate', function(req, res, next) {
  dateEvent = req.body.dateEvent;
  console.log(dateEvent);
  res.send();
})

router.post('/addEvent', function(req, res, next) {
  // Connect to the database
  console.log(req.body);
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "CALL create_event (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query, [user.user_id, req.body.event_name, dateEvent, req.body.duration, req.body.time_zone, req.body.hold_location, req.body.due_date, req.body.note, req.body.share_link, req.body.isOnline], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        console.log(err)
        return;
      }
      res.json(rows); //send response
    });
  });
})

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

/* POST update email. */
router.post('/updateEmail', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE User SET email = ? WHERE user_id = ?";
    connection.query(query, [req.body.email, req.body.user_id], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(); //send response
    });
  });
})

/* POST update email preference. */
router.post('/updateEmailPreference', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE Email_preference SET user_respond = ?, avail_confirm = ?, event_finalize = ?, event_cancel = ? WHERE user_id = ?";
    connection.query(query, [req.body.user_respond, req.body.avail_confirm, req.body.event_finalize, req.body.event_cancel, user.user_id], function(err, rows, fields) {
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
