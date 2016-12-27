var express = require('express');
var router = express.Router();

var comment_action = require('../action/comment.action.js');

router.get(['/', '/all'], (req, res, next) => {

    comment_action.list({}).then(rs => {
        return res.render('comment/list', {
            list: rs.content,
            isLogin: req.session.isLogin
        });
    }).catch(err => {
        return res.render('error/error', {
            message: err.message,
            error: err
        });
    });
});

router.get('/my', (req, res, next) => {

});

router.get('/add', (req, res, next) => {
    if (!req.session.isLogin) {
        return res.redirect('/user?msg=NeedLogin');
    }

    return res.render('comment/add', {
        isLogin: req.session.isLogin
    });
});

router.post('/add', (req, res, next) => {
    if (!req.session.isLogin) {
        return res.redirect('/user?msg=NeedLogin');
    }

    var param = {
        from: req.session.userInfo && req.session.userInfo.id,
        to: req.body.to || null,
        content: req.body.content
    };

    if (!param.from || !param. content) {
        return res.json({
            status: '3200',
            content: 'param from & content is needed'
        });
    }

    comment_action.add(param).then(rs => {
        return res.redirect('/comment');
    }).catch(err => {
        return res.render('error/error', {
            message: err.message,
            error: err
        });
    });
});

module.exports = router;
