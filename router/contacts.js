'use strict';

var _ = require('lodash');
var db = require('../db');

module.exports = function (router) {
    var _rules = {
        '/dev/api/contacts/:id/deals': 'GET',
        '/dev/api/contacts/:id/notes': 'GET',
        '/dev/api/contacts/:id/events': 'GET',
        '/dev/api/contacts/:id/events/sort': 'GET',
        '/dev/api/contacts/:id/tasks': 'GET',
        '/dev/api/contacts/search/email/:email': 'GET',
        '/dev/api/contacts/search/email': 'POST',
        '/dev/api/contacts/email/note/add': 'POST',
        '/dev/api/contacts/add/property': 'POST'
    };
    /* 
        TODO

        '/dev/api/contacts/companies/list': 'POST'
    */
    var handlers = {

        post: function (req, res, next) {

            /* /dev/api/contacts/search/email */
            if (req.body.email_ids) {
                var email_ids = _.uniq(JSON.parse(req.body.email_ids));
                if (email_ids.length > 0) {
                    var result = email_ids.map(function (e) {
                        return req.db.contacts.getByEmail(e);
                    }).filter(function (o) {
                        return o != null;
                    });

                    res.jsonp(result).end();
                    return;
                }
            }

            /* /dev/api/contacts/email/note/add */
            if (req.body.email && req.body.note) {
                var n = req.body.note;
                var e = req.body.email;

                req.params.resource = "notes";
                req.params.email = e;
                req.url = "/dev/api/notes/email/" + e;
                req.body = JSON.parse(n);
                return next();
            }
            /* /dev/api/contacts/add/property */
            if (req.query.email && req.body.type && req.body.name && req.body.value) {
                var contact = req.db.contacts.getByEmail(req.query.email);
                if (contact) {
                    var newContact = {
                        id: contact.id,
                        properties: []
                    };
                    newContact.properties.push(req.body);
                    req.body = req.db.mergeForPatch(contact, newContact);
                    req.method = "PATCH";
                    req.url = '/dev/api/contacts/' + contact.id;
                }
            }

            next();
        },

        get: function (req, res, next) {

            if (req.params.email) {
                // handles rule /dev/api/contacts/search/email/:email
                res.jsonp(req.db.contacts.getByEmail(req.params.email) || {}).end();
                return;
            }

            if (req.route.path.endsWith('/deals')) {
                // handles rule /dev/api/contacts/:id/deals
                res.jsonp(req.db.opportunity.getByContactId(req.params.id)).end();
                return;
            } else if (req.route.path.endsWith('/notes')) {
                // handles rule /dev/api/contacts/:id/notes
                res.jsonp(req.db.notes.getByContactId(req.params.id)).end();
                return;
            } else if (req.route.path.endsWith('/events') || req.route.path.endsWith('/events/sort')) {
                // handles rule /dev/api/contacts/:id/events
                res.jsonp(req.db.events.getByContactId(req.params.id)).end();
                return;
            } else if (req.route.path.endsWith('/tasks')) {
                // handles rule /dev/api/contacts/:id/events
                res.jsonp(req.db.tasks.getByContactId(req.params.id)).end();
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

    router.rules['contacts'] = _rules;
};