'use strict';

const express = require('express');
var _db = require('../db');

module.exports = function (db) {
    var router = express.Router();
    router.use((req, res, next) => {
        if (!req.db) {
            req.db = _db(db);
        }
        next();
    })

    router.rules = {};
    require('./contacts')(router);
    require('./opportunity')(router);
    require('./tasks')(router);
    require('./notes')(router);
    require('./events')(router);
    require('./partial-update')(router);
    require('./email')(router);

    router.get('/__rules2', function (req, res) {
        res.json(router.rules);
    });

    return router;
};
