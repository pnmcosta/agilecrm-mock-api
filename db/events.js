'use strict';
const _ = require('lodash');
module.exports = function (parent) {
    return {
        getByEmail: function (email) {
            return parent.getByContactEmail('events', email);
        },
        getByContactId: function (id) {
            return parent.getByContactId('events', id);
        },
        getByDealId: function (id) {
            return parent.getByDealId('events', id);
        }
    };
};