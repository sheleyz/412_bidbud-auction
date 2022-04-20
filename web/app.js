require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
var session = require('express-session');
const { Firestore } = require('@google-cloud/firestore');
const { FirestoreStore } = require('@google-cloud/connect-firestore');
const { v4: uuidv4 } = require('uuid');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var biddersRouter = require('./routes/bidders');

var app = express();

// Set up the Session
// Using sessions with Firestore: https://cloud.google.com/nodejs/getting-started/session-handling-with-firestore#cloud-shell
app.use(
    session({
        genid: (req) => {
            console.log(req.sessionID);
            return uuidv4();
        },
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 * 2 },
        store: new FirestoreStore({
            dataset: new Firestore(),
            kind: 'express-sessions',
        })
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware to choose a layout for the pages
app.use(function (req, res, next) {
    if (req.isAuthenticated()) {
        app.set('view options', { layout: 'layout_user' });
    } else {
        app.set('view options', { layout: 'layout' });
    }
    return next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bidders', biddersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
