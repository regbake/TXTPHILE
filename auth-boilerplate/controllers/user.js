var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');
var isLoggedIn = require('../middleware/isLoggedIn');

router.get("/", isLoggedIn, function(req, res){
    res.render("user/home");
});





module.exports = router;
