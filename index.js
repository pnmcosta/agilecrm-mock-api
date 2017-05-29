'use strict';

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(require('./db/schema.json'));
const middlewares = jsonServer.defaults();
const customRouter = require('./router')(router.db);
const basicAuth = require('express-basic-auth');

server.use('/dev/api*', basicAuth({
    users: {
        'mock@agilecrm.com': 'secret1234'
    },
    challenge: true,
    realm: 'Imb4T3st4pp'
}));

server.use(middlewares);

server.use(jsonServer.bodyParser);

//server.use(jsonServer.rewriter({
//    '/dev/api/search': '/dev/api/contacts'
//}));

server.use(customRouter);

server.get('/__rules', function (req, res) {
    res.json({});
});

server.use('/dev/api', router);

server.listen(3000, () => {
    console.log('Agile CRM Mock Rest API Server is running on http://localhost:3000/');
});