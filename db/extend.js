'use strict';
const _ = require('lodash');
const $resources = ['contacts', 'opportunity', 'notes', 'tasks', 'events'];
const $nested = {
    'contacts': ['contact_ids', 'contacts'],
    'opportunity': ['deal_ids', 'deals'],
    'notes': ['note_ids', 'notes']
};
module.exports = function (me) {
    _.defaultsDeep(me, {
        _resources: $resources,
        _nested: $nested,

        get: function (resource) {
            if ($resources.indexOf(resource) === -1)
                return [];
            return me.db.get(resource).value();
        },
        getById: function (resource, id) {
            if ($resources.indexOf(resource) === -1 || isNaN(id))
                return null;
            return me.db.get(resource).find({ 'id': id }).value();
        },
        getByContactEmail: function (resource, email) {
            if ($resources.indexOf(resource) === -1)
                return [];

            var contact = me.contacts.getByEmail(email);
            if (contact)
                return me.getByContactId(resource, contact.id);
            return [];
        },
        getByContactId: function (resource, id) {
            if ($resources.indexOf(resource) === -1 || isNaN(id))
                return [];

            var resources = me.get(resource);
            return resources.filter(function (o) {
                var found = o.contact_ids && o.contact_ids.indexOf(id) !== -1;
                if (found) return true;
                return o.contacts && o.contacts.filter(function (p) {
                    return p.id == id;
                }).length > 0;
            });
        },
        getByDealId: function (resource, id) {
            if ($resources.indexOf(resource) === -1 || isNaN(id))
                return [];

            var resources = me.get(resource);
            return resources.filter(function (o) {
                var found = o.deal_ids && o.deal_ids.indexOf(id) !== -1;
                if (found) return true;

                return o.deals && o.deals.filter(function (p) {
                    return p.id == id;
                }).length > 0;
            });
        },
        mergeForPatch: function (resource, data) {
            if (data.properties && resource.properties) {
                data.properties = _.concat(data.properties, _.filter(resource.properties, function (o) {
                    var check = _.clone(o);
                    _.unset(check, "value");
                    return _.findIndex(data.properties, check) === -1;
                }));
            }

            if (data.custom_data && resource.custom_data) {
                data.custom_data = _.concat(data.custom_data, _.filter(resource.custom_data, function (o) {
                    var check = _.clone(o);
                    _.unset(check, "value");
                    return _.findIndex(data.custom_data, check) === -1;
                }));
            }
            return data;
        },
        filterProperties: function (objects, filters) {
            if (_.isArray(objects) && filters) {

                var properties = [];
                _.forEach(objects, function (o) {
                    _.forEach(filters, function (f) {
                        if (_.isMatch(o, f)) {
                            properties.push(o);
                            return false;
                        }
                    });
                });

                return properties;
            }
            return [];
        },
        getMin: function (resource, data) {
            if ($resources.indexOf(resource) === -1)
                return data;
            return me[resource].getMin(data);
        },
        hasNested: function (resource, data) {
            var fields = $nested[resource];
            if (!fields) return false;

            return _.some(fields, _.partial(_.has, data));
        },
        ensureNested: function (resource, data) {
            if (!me.hasNested(resource, data)) {
                return data;
            }

            var fields = $nested[resource];
            if (!fields)
                return data;


            var ids = [];
            _.forEach(fields, function (f) {
                var v = data[f];
                if (_.isArray(v) && v.length > 0) {
                    ids = ids.concat(v.map(function (o) {
                        if (!isNaN(o))
                            return Number(o);
                        return Number(_.get(o, 'id', 0));
                    }).filter(function (o) {
                        return !isNaN(o) && o > 0;
                    }));
                }
            });
            ids = _.uniq(ids);
            if (ids.length > 0)
                data = me.setNestedByIds(resource, data, ids);

            return data;
        },
        setNested: function (resource, data, objects) {
            if (!objects)
                return data;

            var fields = $nested[resource];
            if (!fields)
                return data;

            var index = {};
            if (_.isArray(objects)) {
                _.forEach(objects, function (o) {
                    index[String(o.id)] = me.getMin(resource, o);
                });
            } else if (_.isObject(objects)) {
                index[String(objects.id)] = me.getMin(resource, objects);
            }
            if (index === {})
                return data;

            _.forEach(fields, function (f) {
                if (f.indexOf("_ids") !== -1) {
                    data[f] = _.merge(data[f] || [], _.keys(index));
                } else {
                    data[f] = _.merge(data[f] || [], _.values(index));
                }
            });

            return data;
        },
        setNestedByIds: function (resource, data, ids) {
            if (!ids)
                return data;

            var fields = $nested[resource];
            if (!fields)
                return data;

            var objects = ids.map(function (id) {
                return me.getById(resource, id);
            }).filter(function (o) {
                return o != null;
            });

            return me.setNested(resource, data, objects);
        }
    });

    return me;
}
