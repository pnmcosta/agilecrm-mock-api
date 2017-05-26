'use strict';
const _ = require('lodash');
module.exports = function (parent) {
    return {
        getByEmail: function (email) {
            return parent.getByContactEmail('tasks', email);
        },
        getByContactId: function (id) {
            return parent.getByContactId('tasks', id);
        },
        getByDealId: function (id) {
            return parent.getByDealId('tasks', id);
        }
    };
};