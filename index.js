// 基本包引入
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

// 自建模块引入
var dbAdap = require('./src/lib/dbAdap.js');
var debug = require('./src/lib/debug.js');

// 路由引入
var index_router = require('./src/router/index.js');
var user_router = require('./src/router/users.js');

// 应用声明
var app = express();

// --- 应用初始化 ---

// 模板引擎设置
app.set('views', path.join(__dirname, 'src/view'));
app.set('view engine', 'hbs');

// http请求处理
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'A secret string.',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true
    }
}));

// 静态资源文件夹, 暂时使用, 后期并入 nginx/apache 静态资源路径, 这里取消
app.use(express.static(path.join(__dirname, 'static')));

// 挂载debug中间件
app.use(debug);

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

// 服务初始化函数
function init() {
    // db connect init & http server init
    dbAdap.init({
        mongodb: 'mongodb://127.0.0.1:27017/test'
    });

    dbAdap.on('db_connect', () => {
        console.log('mongodb connected.');

        // http server init
        var server = app.listen(3000, () => {
            var host = server.address().address;
            var port = server.address().port;
            console.log('App listening at http://%s:%s', host, port);
        });
    });

    dbAdap.on('error', (err) => {
        console.log('db connect error, %s', err && err.stack);
        console.log('try start in 3s ......');

        setTimeout(dbAdap.init, 3 * 1000);
    });
}

// 服务初始化
init();

module.exports = app;

// TODO:
// 抽取 session | 端口 | dbconf 等通用配置文件
