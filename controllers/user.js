var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');
var isLoggedIn = require('../middleware/isLoggedIn');
var request = require("request");

//multer shiz
var multer = require("multer");
var fs = require("fs");
var storage = multer.memoryStorage()
var upload = multer({storage: storage});

//removed isLoggedIn for testing
router.get("/", isLoggedIn, function(req, res){
  var currentUserId = req.user.dataValues.id;

  db.document.findAll({
    where: {userId: currentUserId}
  }).then(function(document){
    res.render("user/home", {
      currentUser: req.user,
      document: document
    });
  });
});

//delete
router.delete("/:id", isLoggedIn, function(req,res){
  var postId = req.params.id;
  var currentUserId = req.user.dataValues.id;

  db.document.destroy({
    where: {userId: currentUserId,
      id: postId
      }
  }).then(function(document){
    res.send({message: "success"});
  });
});

router.put("/:id", isLoggedIn, function(req,res){
  var postId = req.params.id; //the id of the current post
  var currentUserId = req.user.dataValues.id;
  var newContent = req.body.editInput;

  db.document.update({
    body: newContent
  }, {
    where: {userId: currentUserId,
    id: postId
    }
  }).then(function(document){
    res.send({message: "success"});
  });
});

router.get("/poems", isLoggedIn, function(req, res){
  res.render("poems/authors");
});

router.get("/:id/edit", isLoggedIn, function(req, res){
  var postId = req.params.id; //the id of the current post
  var currentUserId = req.user.dataValues.id;

  db.document.findOne({
    where: {userId: currentUserId,
      id: postId
      }
  }).then(function(document){
    res.render("user/view-input", {document: document});
  });
});

router.get("/author", isLoggedIn, function(req, res){
  var poetryUrl = "http://poetrydb.org/author";

  request(poetryUrl, function(error, response, body){
    var authors = JSON.parse(body);
    console.log(authors);
    res.render("poems/authors", {authors: authors});
  });
});

//GET titles
router.get("/author/:authorName", isLoggedIn, function(req, res){
  var currentAuthor = req.params.authorName;
  var poetryUrl = "http://poetrydb.org/author/" + currentAuthor + "/title";

  request(poetryUrl, function(error, response, body){
    var titles = JSON.parse(body);
    console.log(titles);
    res.render("poems/titles", {titles: titles, currentAuthor: currentAuthor});
  });
});

router.get("/author/:authorName/title/:titleName", isLoggedIn, function(req, res){
  var currAuthor = req.params.authorName;
  var currTitle = req.params.titleName;
  var poetryUrl = "http://poetrydb.org/title,author/" + currTitle + ";" + currAuthor + "/lines.json";
  console.log("made it thus far");
  request(poetryUrl, function(error, response, body){
    var poem = JSON.parse(body);
    console.log(poem);
    res.render("poems/poem", {
      currTitle: currTitle,
      currAuthor: currAuthor,
      poem: poem
    });
  });
});

//handle the uploaded files
router.post("/", isLoggedIn, upload.single("myFile"), function(req, res){
  var currentUserId = req.user.dataValues.id;
  var userInput = req.body.userInput; //input from textform

  if (req.file !== undefined){
    var text = req.file.buffer.toString("utf8"); //text from upload
  }

  if (text !== undefined) { //the input from textform
    db.document.create({
      body: text,
      userId: currentUserId
    })
    res.redirect("/user");
  } else if (userInput !== undefined) {
    db.document.create({ //to handle the uploaded   text
      body: userInput,
      userId: currentUserId
    }).then(function(){
      res.redirect("/user");
    });
  } else {
    res.redirect("/user");
  }
});

module.exports = router;
