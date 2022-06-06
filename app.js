var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var session = require('express-session'); // THIS CODE //

// use mysql in this app
var mysql = require('mysql');
// create a 'pool' (group) of connections to be used for connecting with our SQL server
var dbConnectionPool = mysql.createPool({
 host: 'localhost',
 database: 'universal_meet'
});

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware for accessing database: We need access to the database to be available *before* we process routes in index.js,
// so this code needs to be *before* the app.use('/', routes);
// Express will run this function on every request and then continue with the next module, index.js.
// So for all requests that we handle in index.js, we’ll be able to access the pool of connections using req.pool
app.use(function(req, res, next) {
    req.pool = dbConnectionPool;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({                       // //
    secret: 'BJNM',  // //
    resave: false,                      // THIS CODE //
    saveUninitialized: true,            // //
    cookie: { secure: false }           // //
   }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

module.exports = app;
