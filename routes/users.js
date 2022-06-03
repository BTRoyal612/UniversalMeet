var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
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
    var query = "SELECT * FROM User WHERE user_id = ?";
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
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "SELECT * FROM Event_pending WHERE user_id = ?";
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

/* POST get event. */
router.post('/getEvent', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "SELECT * from Even WHERE event_id = ?";
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
router.post('/addEvent', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "INSERT INTO Event (creator_id, event_name, duration, time_zone, hold_location, due_date, note, share_link, isOnline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query, [req.body.creator_id, req.body.event_name, req.body.duration, req.body.time_zone, req.body.hold_location, req.body.due_date, req.body.note, req.body.share_link,  req.body.isOnline], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(); //send response
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

/* POST add chosen time */
router.post('/addChosenTime', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    for(time_frame of req.body.chosen_time){
      var query = "CALL choose_time(?, ?, ?);";

      /* Since the req.body.chosen_time is an array, we need to call choose_time several times for each chosen_time */
      /* Im not sure if this format is right */
      connection.query(query, [req.body.event_id, req.body.user_id, time_frame],function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          res.sendStatus(500);
          return;
        }
      });
    }
    res.send(); //send response
  });
})

/* POST delete chosen time */
router.post('/deleteChosenTime', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    for(time_frame of req.body.chosen_time){
      var query = "CALL delete_time(?, ?, ?);";

      /* Since the req.body.chosen_time is an array, we need to call choose_time several times for each chosen_time */
      /* Im not sure if this format is right */
      connection.query(query, [req.body.event_id, req.body.user_id, time_frame],function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          res.sendStatus(500);
          return;
        }
      });
    }
    res.send(); //send response
  });
})

/* POST get count how many user choose a time */
router.post('/countChosenTime', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    for(time_frame of req.body.chosen_time){
      var query = "SELECT * FROM Pp_number WHERE event_id = ? AND chosen_time = ?;";

      /* Since the req.body.chosen_time is an array, we need to call choose_time several times for each chosen_time */
      /* Im not sure if this format is right */
      connection.query(query, [req.body.event_id, time_frame],function(err, rows, fields) {
        connection.release(); // release connection
      });
    }
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.send(); //send response
  });
})

/* POST event creator add availability */
router.post('/addAvailability', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    for(time_frame of req.body.chosen_time){
      var query = "CALL add_availability(?, ?, ?);";

      /* Since the req.body.chosen_time is an array, we need to call choose_time several times for each chosen_time */
      /* Im not sure if this format is right */
      connection.query(query, [req.body.event_id, req.body.user_id, time_frame],function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          res.sendStatus(500);
          return;
        }
      });
    }
    res.send(); //send response
  });
})

/* POST show all Availability */
router.post('/showAvailability', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
      var query = "SELECT Event_availability.avail_time, Event.duration FROM Event INNER JOIN Event_availability ON Event.event_id = Event_availability.event_id WHERE Event_availability.event_id = ?;";

      connection.query(query, [req.body.event_id],function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          res.sendStatus(500);
          return;
        }
        res.send(rows); //send response
      });

  });
})




module.exports = router;
