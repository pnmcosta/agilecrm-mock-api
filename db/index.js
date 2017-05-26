'use strict';

const _ = require('lodash');

module.exports = function (db) {
    var me = {
        db: db
    };

    require('./extend')(me);
    
    for (var i = 0; i < me._resources.length; i++) {
        var r = me._resources[i];
        me[r] = require('./' + r)(me);
    }

    return me;
};