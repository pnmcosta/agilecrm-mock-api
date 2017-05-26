'use strict';

/* global m */

// Resource list
var db = {};

m.request({ method: "GET", url: "/dev/api/db", user: "mock@agilecrm.com", password:"secret1234" }).then(function (data) {
    db = data;
});

m.mount(document.getElementById('resources'), {
    view: function view() {
        var keys = Object.keys(db);
        var resourceList = m('ul', keys.map(function (key) {
            return m('li', [m('a', { href: '/dev/api/' + key }, '/dev/api/' + key), m('sup', Array.isArray(db[key]) ? ' ' + db[key].length + 'x' : ' object')]);
        }).concat([m('a', { href: '/dev/api/db' }, '/dev/api/db'), m('sup', m('em', ' state'))]));

        return [m('h4', 'Resources'), keys.length ? resourceList : m('p', 'No resources found')];
    }
});

// Custom routes
var customRoutes = {};
var additionalRoutes = {};

m.request('/__rules').then(function (data) {
    customRoutes = data;
});

m.request('/__rules2').then(function (data) {
    additionalRoutes = data;
});

m.mount(document.getElementById('custom-routes'), {
    view: function view() {
        var result = [];

        var rules = Object.keys(customRoutes);
        if (rules.length) {
            result = result.concat([m('h4', 'Custom routes'), m('table', rules.map(function (rule) {
                return m('tr', [m('td', rule), m('td', '⇢ ' + customRoutes[rule]), m('td', m('code', { class: 'ALL' }, 'ALL'))]);
            }))]);
        }

        var groups = Object.keys(additionalRoutes);
        if (groups.length) {
            result = result.concat(groups.map(function (group) {
                rules = Object.keys(additionalRoutes[group]);
                return [m('h4', 'Custom ' + group + ' routes'), m('table', rules.map(function (rule) {

                    return additionalRoutes[group][rule].split(',').map(function (method) {
                        return m('tr', [m('td', { style: 'text-align:center;max-width:100px;' }, m('code', { class: method }, method)), m('td', rule)]);
                    });


                }))];
            }));
            result = result.concat();
        }
        return result;
    }
});