var express = require('express');
var router = express.Router();

/* GET users listing. */
var user;
router.get('/', function(req, res, next) {
  user = req.session.user[0];
  console.log(user.user_id);
  res.send('respond with a resource');
});

/* GET users logout. */
router.get('/logout', function(req, res, next) {
  user = null;
  res.send('respond with a resource');
});

/* GET username. */
router.get('/getUsername', function(req, res, next) {
  res.send(user.username);
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
    var query = "CALL change_password(?, ?)";
    connection.query(query, [user.user_id, req.body.new_password], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(); //send response
    });
  });
})

/* POST join event. */
router.post('/joinEvent', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "CALL join_event (?, ?)";
    connection.query(query, [req.body.event_id, user.user_id], function(err, rows, fields) {
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
    var query = "SELECT Event.event_id, Event.event_name, Event.creator_id, Event.user_id FROM Event INNER JOIN Event_pending ON Event.event_id = Event_pending.event_id WHERE user_id = ?"; //mark
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

/* POST get user finalized event for calender. */
router.post('/getEventCalender', function(req, res, next) {
  console.log(user);
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "CALL get_events_on_calender(3)";
    connection.query(query, [], function(err, rows, fields) {
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
      req.session.event = rows[0];
      res.json(rows); //send response
    });
  });
})

/* POST get users email in event. */
router.post('/getUsersInEvent', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "SELECT user_id from Event_pending WHERE event_id = ?";
    connection.query(query, [req.body.event_id], function(err, rows, fields) {
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

/* POST add event. */
router.post('/addEvent', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "CALL create_event (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query, [user.user_id, req.body.event_name, req.body.date, req.body.duration, req.body.time_zone, req.body.hold_location, req.body.due_date, req.body.note, req.body.share_link, req.body.isOnline], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        console.log(err)
        res.sendStatus(500);
        return;
      }
      req.session.event = rows[0];
      console.log(req.session.event[0].event_id);
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

    var query = "CALL delete_event(?, ?)";
    connection.query(query, [req.body.event_id, user.user_id],function(err, rows, fields) {
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

    var query = "CALL edit_event(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query, [req.session.event[0].event_id, user.user_id, req.body.event_name, req.body.hold_location, req.body.due_date, req.body.note, req.body.isOnline, req.body.duration, req.body.time_zone, req.body.share_link], function(err, rows, fields) {
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

    var query = "CALL choose_time(?, ?, ?);";
    /* Since the req.body.chosen_time is an array, we need to call choose_time several times for each chosen_time */
    /* Im not sure if this format is right [req.session.event.event_id, user.user_id, req.body.chosen_time] */
    connection.query(query, [req.body.event_id, user.user_id, req.body.chosen_time],function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(); //send response
    });
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

    var query = "CALL delete_time(?, ?, ?);";
    /* Since the req.body.chosen_time is an array, we need to call choose_time several times for each chosen_time */
    /* Im not sure if this format is right */
    connection.query(query, [req.body.event_id, user.user_id, req.body.chosen_time],function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        console.log(err)
        res.sendStatus(500);
        return;
      }
      res.send(); //send response
      });
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

    var query = "SELECT * FROM Pp_number WHERE event_id = ? AND chosen_time = ?;";
      /* Since the req.body.chosen_time is an array, we need to call choose_time several times for each chosen_time */
      /* Im not sure if this format is right */
    connection.query(query, [req.body.event_id, req.body.chosen_time],function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(rows);
    });
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

    var query = "CALL add_availability(?, ?, ?)";
    /* Since the req.body.chosen_time is an array, we need to call choose_time several times for each chosen_time */
    /* Im not sure if this format is right */
    connection.query(query, [req.session.event[0].event_id, user.user_id, req.body.time_frame] ,function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(); //send response
    });
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

    var query = "SELECT avail_time FROM Event_availability WHERE event_id = ?;";
    connection.query(query, [req.body.event_id],function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
})

/* GET get email. */
router.get('/getEmail', function(req, res, next) {
  res.send(user.email); //send response
})

/* POST update email. */
router.post('/updateEmail', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    var query = "CALL change_email(?, ?)";
    connection.query(query, [user.user_id, req.body.new_email], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(); //send response
    });
  });
})

/* POST get preference about user respond. */
router.post('/getURPreference', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    var query = "SELECT user_respond, email FROM Email_preference INNER JOIN User ON User.user_id = Email_preference.user_id WHERE Email_preference.user_id = ?";
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

/* POST get preference about event cancel and event finalize. */
router.post('/getFCPreference', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    var query = "SELECT event_cancel, event_finalize, email FROM Email_preference INNER JOIN User ON User.user_id = Email_preference.user_id WHERE Email_preference.user_id = ?";
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

/* POST get email preference. */
router.post('/getEmailPreference', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    var query = "SELECT * FROM Email_preference WHERE user_id = ?";
    connection.query(query, [user.user_id], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
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

    var query = "CALL change_notification(?, ?, ?, ?, ?)";
    connection.query(query, [user.user_id, req.body.user_respond, req.body.avail_confirm, req.body.event_finalize, req.body.event_cancel], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(); //send response
    });
  });
})

/* POST finalize event. */
router.post('/finalizeEvent', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    var query = "CALL finalise_event(?, true)";
    connection.query(query, [req.body.event_id], function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(); //send response
    });
  });
})

router.get('/profile', function(req, res, next) {
  res.render('profile');
})

router.get('/noti_preferences', function(req, res, next) {
  res.render('noti_preferences');
})

router.post('/calendar', function(req, res, next) {
  res.render('calendar');
})

router.post('/event-info', function(req, res, next) {
  let date = req.body.eventDate;
  res.render('event-info', {date: date});
})

router.post('/availability', function(req, res, next) {
  res.render('availability');
})

router.post('/invitation', function(req, res, next) {
  // console.log(req.rawHeaders[23])
  res.render('invitation', {event_id: req.session.event[0].event_id, url:req.rawHeaders[23]});
})

router.get('/pending-events', function(req, res, next) {
  res.render('pending-events');
})

router.post('/invite-response', function(req, res, next) {
  eventId = req.body.eventId;
  res.render('invite-response', {eventId: eventId});
})

router.post('/host-event', function(req, res, next) {
  eventId = req.body.eventId;
  res.render('host-event', {eventId: eventId});
})

function deserialize(id) {
  res = 0;
  for (let i = 0; i < id.length; i++) {
    res = res + (id.charCodeAt(i) - 97) * (26 ** (id.length - 1 - i));
  }
  return res;
}

router.get('/invitation-response/:id', function(req, res, next) {


  let id = deserialize(req.params.id);
  console.log(id)
  res.render('invitation-response', {event_id: id});
})

router.get('/invite-response/:id', function(req, res, next) {


  let id = deserialize(req.params.id);
  console.log(id)
  res.render('invite-response', {eventId: id});
})
module.exports = router;

