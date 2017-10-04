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
  console.log(req.body.input)
  res.redirect("/user");
});




module.exports = router;
