var express = require('express');
var router = express.Router();

var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

var ctrlCleaning = require('../controllers/cleaning');

// Cleaning
router.post('/cleanings/execute', ctrlCleaning.cleaningsExecute);

module.exports = router;
