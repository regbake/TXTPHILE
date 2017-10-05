var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');
var isLoggedIn = require('../middleware/isLoggedIn');

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
