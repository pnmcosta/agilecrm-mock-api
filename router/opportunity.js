'use strict';

module.exports = function (router) {
    var _rules = {
        '/dev/api/opportunity/:id/notes': 'GET',
        '/dev/api/opportunity/:id/events': 'GET',
        '/dev/api/opportunity/:id/tasks': 'GET',
        '/dev/api/opportunity': 'POST',
        '/dev/api/opportunity/deals/:resource': 'POST,PUT'
    };
    /* 
        TODO

        '/dev/api/opportunity/partial-update/delete-contact': 'PUT'
    */

    var handlers = {
        get: function (req, res, next) {
            if (req.params.id) {
                if (req.route.path.endsWith('/notes')) {
                    res.jsonp(req.db.notes.getByDealId(req.params.id)).end();
                    return;
                } else if (req.route.path.endsWith('/events')) {
                    res.jsonp(req.db.events.getByDealId(req.params.id)).end();
                    return;
                } else if (req.route.path.endsWith('/tasks')) {
                    res.jsonp(req.db.tasks.getByDealId(req.params.id)).end();
                    return;
                }
            }
            next();
        },
        post: function (req, res, next) {
            handlers._putpost(req, res, next);
        },
        put: function (req, res, next) {
            handlers._putpost(req, res, next);
        },
        _putpost: function (req, res, next) {
            /* /dev/api/opportunity/deals/:resource */
            if (req.params.resource) {
                if ($supported.indexOf(req.params.resource) === -1) {
                    res.status(404).end();
                    return;
                }
                if (req.method === 'PUT' && !req.body.id) {
                    res.status(400).end();
                    return;
                }

                req.body = req.db.ensureNested('opportunity', req.body);

                req.url = '/dev/api/' + req.params.resource;

                if (req.method === 'PUT') {
                    req.method === 'PATCH';
                    req.url += "/" + req.body.id;
                    delete req.body.id;
                }
            }

            /* /dev/api/opportunity */
            if (req.method === 'POST') {
                req.body = req.db.ensureNested('contacts', req.body);
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

    router.rules['opportunity'] = _rules;
};