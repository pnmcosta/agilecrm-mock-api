'use strict';
const _ = require('lodash');
module.exports = function (parent) {
    return {
        getByEmail: function (email) {
            return parent.getByContactEmail('notes', email);
        },
        getByContactId: function (id) {
            return parent.getByContactId('notes', id);
        },
        getByDealId: function (id) {
            return parent.getByDealId('notes', id);
        },
        getMin: function (note) {
            return _.cloneDeep(note);
        }
    };
};