/**
 * MongoDB Adapter.
 *
 * @author wangsu@nextlegal.com
 *
 */

var crypto = require('crypto');
var Mongodb = require('mongodb');
var MongoClient = Mongodb.MongoClient;
var ObjectID = Mongodb.ObjectID;

var EventEmitter = require('events').EventEmitter;

var db = null;

var adap = module.exports = {
    /**
     * TODO: 断开重连未实现,后面再说
     *
     * 初始化DB
     * @return {[type]} [description]
     */
    init: function(db_conf) {
        if (!db_conf) {
            throw new Error('no db conf passed to dbAdap.');
        }

        if (db) {
            return;
        }

        console.log('init db connection');

        // Use connect method to connect to the Server
        MongoClient.connect(db_conf.mongodb, function(err, _db) {

            if (err) {
                adap.emit('error', err);
                return;
            }

            db = _db;

            db.on('reconnect', function(err) {
                console.log('db reconnection, %s', err && err.stack);
            });

            db.on('close', function(err) {

                if (err) {
                    console.log('db close by error. %s', err && err.stack);
                    adap.emit('error', err);
                } else {
                    console.log('db close by manual.');
                    adap.emit('close', err);
                }

                db = null;
            });

            db.on('error', function(err) {
                adap.emit('error', err);
                db.close();
                db = null;
            });

            console.log('Connected correctly to server');

            adap.emit('db_connect');
        });
    },
    getDB: function(name) {
        if (!db) {
            throw new Error('no db connection');
        }

        return name ? db.db(name) : db;
    },
    getCollection: function(name, cb) {

        if (!db) {
            //return cb(new Error('no db connection.'));
            throw new Error('no db connection');
        }

        if (!cb) {
            return Promise.resolve(db.collection(name));
        } else {
            cb(null, db.collection(name));
        }
    },
    newIdString : function() {
        // 获得string对像, 而不是objectId
        return ObjectID().toString();
    },
    __proto__: EventEmitter.prototype
};

EventEmitter.call(adap);
