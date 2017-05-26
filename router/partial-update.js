'use strict';

const _ = require('lodash');

module.exports = function (router, rules) {
    var _rules = {
        '/dev/api/:resource/partial-update': 'PUT',
        '/dev/api/:resource/edit-properties': 'PUT'
    };

    var handlers = {
        put: function (req, res, next) {
            if (req.params.resource && req.body.id) {
                var resource = req.db.getById(req.params.resource, req.body.id);
                if (resource) {
                    req.body = req.db.mergeForPatch(resource, req.body);
                    delete req.body.id;
                    req.method = 'PATCH';
                    req.url = '/dev/api/' + req.params.resource + '/' + resource.id;
                } else {
                    res.json({}).end();
                    return;
                }
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