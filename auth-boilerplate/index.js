require('dotenv').config();
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var request = require("request");
var app = express();

//multer shiz
var multer = require("multer");
var fs = require("fs");
var storage = multer.memoryStorage()
var upload = multer({storage: storage});

var session = require('express-session');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);


/*
 * setup the session with the following:
 *
 * secret: A string used to "sign" the session ID cookie, which makes it unique
 * from application to application. We'll hide this in the environment
 *
 * resave: Save the session even if it wasn't modified. We'll set this to false
 *
 * saveUninitialized: If a session is new, but hasn't been changed, save it.
 * We'll set this to true.
 */
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

//these lines must occur after the session is configured
var passport = require('./config/ppConfig');
app.use(passport.initialize());
app.use(passport.session());

//index page, handles the poetry api stuff
app.get("/", function(req, res){
  res.render("index");
});

app.get("/authors", function(req, res){
  var poetryUrl = "http://poetrydb.org/author";
  
  request(poetryUrl, function(error, response, body){
    var authors = JSON.parse(body);
    res.render("poems/authors", {authors: authors});
  })
});

//handle the uploaded files
app.post("/upload", upload.single("myFile"), function(req, res){
  var text = req.file.buffer.toString("utf8");
  console.log(text);
  res.redirect("/");
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
