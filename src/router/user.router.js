var express = require('express');
var router = express.Router();

var user_action = require('../action/user.action.js');

router.get('/', (req, res, next) => {
    if (req.session.isLogin) {
        res.redirect('/user/detail');
    }

    res.render('user/index', {
        isLogin: req.session.isLogin,
        msg: req.query.msg || ''
    });
});

router.post('/register', (req, res, next) => {
    var param = {
        nickname: req.body.nickname,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
    };

    if (!param.nickname || !param.email || !param.mobile || !param.password) {
        return res.send('param nickname, email, mobile, password is required.');
    }

    user_action.register(param).then(rs => {
        return res.json(rs);
    }).catch(err => {
        return res.json(err);
    });
});

router.post('/login', (req, res, next) => {
    var param = {
        username: req.body.username,
        password: req.body.password
    };

    if (!param.username || !param.password) {
        return res.send('param username, password is required.');
    }

    user_action.login(param).then(rs => {
        req.session.userInfo = rs.content;
        req.session.isLogin = true;
        return res.redirect('/user/detail');
    }).catch(err => {
        return res.render('error/error', {
            message: err.message,
            error: err
        });
    });
});

router.get('/detail', (req, res, next) => {
    if (!req.session.isLogin) {
        return res.redirect('/user?msg=LoginNeed');
    }

    var userInfo = req.session.userInfo;

    userInfo.isLogin = req.session.isLogin;

    return res.render('user/detail', userInfo);
});

router.get('/logout', (req, res, next) => {
    req.session.isLogin = false;
    req.session.userInfo = null;

    return res.redirect('/user?msg=LogoutOK');
});

module.exports = router;
