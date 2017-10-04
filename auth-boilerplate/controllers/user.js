var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');

router.get("/", function(req, res){
    res.render("user/home");
});





module.exports = router;
