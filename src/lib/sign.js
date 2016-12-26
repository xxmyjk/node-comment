var crypto = require('crypto');

var defaultCharts = 'abcdefghijklmnopqrstuvwxyz0123456789';

var sign = module.exports = {
    // 一般不对外使用, 生成md5 base64字符串
    md5: (...args) => {
        if (!args.length) {
            // 这里不抛错, return null在业务逻辑端做相应判断
            return null;
        }
        var s = crypto.createHash('md5');

        // crypto.createHash对象只接受string | buffer作为update参数
        args.map(i => s.update(i.toString()));

        return s.digest().toString('base64');
    },

    // 一般不对外使用, 生成40位 sha1 hex
    sha1: (...args) => {
        if (!args.length) {
            // 这里不抛错, return null在业务逻辑端做相应判断
            return null;
        }
        var s = crypto.createHash('sha1');

        // crypto.createHash对象只接受string | buffer作为update参数
        args.map(i => s.update(i.toString()));

        return s.digest().toString('hex');
    },

    // 一般不对外使用, 生成min到max之间的随机整数
    random: (max, min) => {

        min = ~~min || 0;
        max = ~~max || 0;

        // min, max is not 0
        if (min && max) {
            max = max - min + 1;
            return ~~(Math.random() * max) + min;
        } else if (max) {
            // faster the 0 - max;
            return ~~(Math.random() * max);
        }

        // faster return 0;
        return min;
    },

    // 对外提供盐值生成
    getSalt: () => {
        return sign.md5(sign.randomStr());
    },

    // 对外提供随机字符串
    randomStr: (len) => {
        var str = '';
        len = len || 10;
        while (str.length < len) {
            str += defaultCharts[sign.random(36)];
        }

        return str;
    },

    // password加密
    encodePwd: (pwd, salt) => {
        if (!pwd || !salt) {
            return null;
        }

        return sign.sha1(pwd, salt);
    }
};
