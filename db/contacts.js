'use strict';
const _ = require('lodash');
module.exports = function (parent) {
    return {
        getById: function (id) {
            return parent.getById('contacts', id);
        },
        getByEmail: function (email) {
            return parent.get('contacts').find(function (o) {
                return o.properties && o.properties.filter(function (p) {
                    return p.name === "email" && p.value === email;
                }).length > 0;
            });
        },
        getMin: function (contact) {
            var min = _.pick(contact, ["id", "type", "properties"]);
            min.properties = parent.filterProperties(min.properties,
                [{
                    "type": "SYSTEM",
                    "name": "first_name"
                },
                {
                    "type": "SYSTEM",
                    "name": "last_name"
                },
                {
                    "type": "SYSTEM",
                    "name": "name"
                }]);
            return min;
        }
    };
};