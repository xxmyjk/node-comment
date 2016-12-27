var dbAdap = require('../lib/dbAdap.js');
var co = require('co');

var comment_action = module.exports = {
    list: (param, opt) => {
        if (!param) {
            return Promise.reject({
                status: '3200',
                content: 'no param passed to [comment_action.list]'
            });
        }

        return dbAdap.getCollection('comment')
            .then(col => {
                return col.find({}).sort({ctime: -1}).toArray();
            }).then(rs => {
                return {
                    status: '0',
                    content: rs
                };
            }).catch(err => {
                return {
                    status: err.status || '2000',
                    content: err.content || err
                };
            });
    },

    add: (param, opt) => {
        if (!param) {
            return Promise.reject({
                status: '3200',
                content: 'no param passed to [comment_action.add]'
            });
        }
        var comment = {
            id: dbAdap.newIdString(),
            from: param.from, //写评论人的userId
            to: param.to || null, //被评论的 "评论" 的 ID
            content: param.content,
            ctime: Date.now()
        };

        return dbAdap.getCollection('comment')
            .then(col => {
                return col.insertOne(comment);
            }).then(rs => {
                return {
                    status: '0',
                    content: 'ok'
                };
            }).catch(err => {
                return {
                    status: err.status || '2000',
                    content: err.content || err
                };
            });
    }
};
