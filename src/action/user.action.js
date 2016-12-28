var dbAdap = require('../lib/dbAdap.js');
var sign = require('../lib/sign.js');
var co = require('co');

var user_action = module.exports = {
    register: (param, opt) => {
        if (!param) {
            return Promise.reject({
                status: '3200',
                content: 'no param passed to [user_action.register]'
            });
        }

        var _u = {};
        return co(function*() {
            var col = yield dbAdap.getCollection('user');
                // 判断重复手机号及邮箱
            var isExist = yield col.count({
                '$or': [
                    {
                        email: param.email
                    }, {
                        mobile: param.mobile
                    }
                ]
            });


            if (isExist) {
                return Promise.reject({
                    status: '4011',
                    content: 'user already exists. ' + param.email + ' ' + param.mobile + '.'
                });
            }

            // 基础数据写入
            _u.id = dbAdap.newIdString();
            _u.nickname = param.nickname;
            _u.email = param.email;
            _u.mobile = param.mobile;

            // 生成盐值及密码hash
            _u.salt = sign.getSalt();
            _u.pwdhash = sign.encodePwd(param.password, _u.salt);

            // 生成创建, 修改时间戳
            _u.ctime = _u.utime = Date.now();

            // 入库
            try {
                yield col.insertOne(_u);
            } catch (e) {
                return Promise.reject({
                    status: '2000',
                    content: 'db error.'
                });
            }

            // 入库成功
            return {
                status: '0',
                content: {
                    id: _u.id,
                    msg: 'register user ok.'
                }
            };
        }).catch(err => {
            return Promise.reject({
                status: err.status || '2000',
                content: err.content || err
            });
        });
    },

    login: (param, opt) => {
        if (!param) {
            return Promise.reject({
                status: '3200',
                content: 'no param passed to [user_action.register]'
            });
        }

        return co(function*() {
            var col = yield dbAdap.getCollection('user');

            var u = yield col.findOne({
                '$or': [
                    {
                        email: param.username
                    }, {
                        mobile: param.username
                    }
                ]
            });

            if (!u) {
                return Promise.reject({
                    status: '4101',
                    content: 'find no user by username ' + param.username
                });
            }

            var login_hash = sign.encodePwd(param.password, u.salt);

            if (u.pwdhash === login_hash) {
                var info = {
                    id: u.id,
                    nickname: u.nickname,
                    email: u.email,
                    mobile: u.mobile,
                    mtime: u.mtime,
                    ctime: u.ctime
                };

                return {
                    status: '0',
                    content: info
                };
            } else {
                return Promise.reject({
                    status: '4101',
                    content: 'username or password error ' + param.username
                });
            }
        }).catch(err => {
            return Promise.reject({
                status: err.status || '2000',
                content: err.content || err
            });
        });
    },

    getInfo: (param, opt) => {
        if (!param) {
            return Promise.reject({
                status: '3200',
                content: 'no param passed to [user_action.getInfo]'
            });
        }

        return co(function*() {
            var col = yield dbAdap.getCollection('user');

            var u = yield col.findOne({id: param.uid});

            if (!u) {
                return Promise.reject({
                    status: '4101',
                    content: 'find no user by uid: ' + param.uid
                });
            }

            var info = {
                id: u.id,
                nickname: u.nickname,
                email: u.email,
                mobile: u.mobile,
                mtime: u.mtime,
                ctime: u.ctime
            };

            return {
                status: '0',
                content: info
            };
        }).catch(err => {
            return Promise.reject({
                status: err.status || '2000',
                content: err.content || err
            });
        });
    }
};
