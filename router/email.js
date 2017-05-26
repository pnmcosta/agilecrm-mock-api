'use strict';

const _ = require('lodash');
const $supported = ['tasks', 'opportunity', 'notes'];

module.exports = function (router, rules) {

    var _rules = {
        '/dev/api/:resource/email/:email': 'GET,POST',
    };
    var _supported = ['tasks', 'opportunity', 'notes'];
    var handlers = {
        post: function (req, res, next) {
            if (req.params.resource && req.params.email) {
                if ($supported.indexOf(req.params.resource) === -1)
                {
                    res.status(404).end();
                    return;
                }

                var contact = req.db.contacts.getByEmail(req.params.email);
                if (contact) {
                    req.body = req.db.setNested('contacts', req.body, contact);
                    req.url = '/dev/api/' + req.params.resource;
                } else {
                    res.json({}).end();
                    return;
                }
            }
            next();
        },
        get: function (req, res, next) {
            if (req.params.resource && req.params.email) {
                res.jsonp(req.db.getByContactEmail(req.params.resource, req.params.email)).end();
                return;
            }
            next();
        }
    };

    Object.keys(_rules).map(function (rule) {
        _rules[rule].toLowerCase().split(',').map(function (method) {
            var m = router[method];
            var h = handlers[method];
            h && m && m.call(router, rule, h);
        });
    });

    router.rules['resource'] = _.merge(_rules, router.rules['resource']);
};