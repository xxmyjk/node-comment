var express = require('express');
var router = express.Router();

var user_action = require('../action/user.action.js');

router.get('/', (req, res, next) => {
    res.send('这里应该是登录注册引导页');
});

router.post('/register', (req, res, next) => {

});

router.post('/login', (req, res, next) => {

});

module.exports = router;
