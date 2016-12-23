// 基本包引入
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 路由引入
var index_router = require('./src/router/index.js');
var user_router = require('./src/router/users.js');

// 应用声明
var app = express();

// --- 应用初始化 ---

// 模板引擎设置
app.set('views', path.join(__dirname, 'src/view'));
app.set('view engine', 'hbs');

// http请求体处理
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));

// 业务逻辑路由挂载
app.use('/', index_router);
app.use('/users', user_router);

// 404 & 500 异常处理
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

// 应用启动
app.listen(3000, () => {
    console.log('app start...');
});

module.exports = app;
