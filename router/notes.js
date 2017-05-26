'use strict';

module.exports = function (router) {
    var _rules = {
        '/dev/api/notes': 'POST'
    };
    var handlers = {
        post: function (req, res, next) {
            /* /dev/api/opportunity */
            req.body = req.db.ensureNested('contacts', req.body);
            req.body = req.db.ensureNested('opportunity', req.body);
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

    router.rules['notes'] = _rules;
};