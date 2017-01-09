'use strict';

var logger = require('logger');
var JSONAPISerializer = require('jsonapi-serializer').Serializer;

var userSerializer = new JSONAPISerializer('user', {
    attributes: [
        'name', 'email', 'createdAt', 'role'
    ],


    typeForAttribute: function (attribute) {
        return attribute;
    },
    keyForAttribute: 'camelCase'
});

class UserSerializer {
    static serialize(data) {
        return userSerializer.serialize(data);
    }
}

module.exports = UserSerializer;
