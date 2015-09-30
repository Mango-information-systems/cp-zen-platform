'use strict';

var _ = require('lodash');
var cacheTimes = require('../../web/config/cache-times');

exports.register = function (server, options, next) {
  // TODO - set basePath properly..
  options = _.extend({ basePath: '/api/1.0' }, options);

  server.route([{
    method: 'GET',
    path: options.basePath + '/countries',
    handler: countries,
    config: {
      cache: {
        expiresIn: cacheTimes.long
      }
    }
  }]);

  next();
};

var countries = function (request, reply) {
  reply.act({cmd: 'list_countries', role: 'cd-dojos'});
};

exports.register.attributes = {
  name: 'api-dojos'
};
