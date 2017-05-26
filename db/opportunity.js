'use strict';
const _ = require('lodash');
module.exports = function (parent) {
    return {
        getById: function (id) {
            return parent.getById('opportunity', id);
        },
        getByContactEmail: function (email) {
            return parent.getByContactEmail('opportunity', email);
        },
        getByContactId: function (id) {
            return parent.getByContactId('opportunity', id);
        },
        getMin: function (opportunity) {
            return _.pick(opportunity, ["id", "name"]);
        }
    };
};