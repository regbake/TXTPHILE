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
router.get("/", function(req, res){
    res.render("user/home");
});

//handle the uploaded files
router.post("/upload", upload.single("myFile"), function(req, res){
  var text = req.file.buffer.toString("utf8");
  userUploads.push(text);
  console.log(userUploads);
  // console.log(text, text.length);
  res.redirect("/");
});

//to handle the uploaded text
router.post("/", function(req, res){
  var userInput = req.body.userInput; //input from textform
  db.document.create({
    body: userInput
  }).then(function(){
    res.redirect("/user");
  });

  //user upload is in a string, I should be able to put this into the
  //db at this point, I can add functions to clean the data later
});




module.exports = router;
