var debug = module.exports = function(req, res, next) {
    console.log('req headers: %j', req.headers);

    console.log('------');

    console.log('req body: %j', req.body);
    console.log('req query: %j', req.query);


    console.log('------');

    console.log('req session: ', req.session);
    next();
};
