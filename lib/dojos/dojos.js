'use strict';

var _ = require('lodash');
var cacheTimes = require('../../web/config/cache-times');

exports.register = function (server, options, next) {
  // TODO - set basePath properly..
  options = _.extend({ basePath: '/api/2.0' }, options);

  server.route([{
    method: 'GET',
    path: options.basePath + '/countries',
    handler: countries,
    config: {
      cache: {
        expiresIn: cacheTimes.long
      }
    }
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/search_bounding_box',
    handler: search_bounding_box,
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

var search_bounding_box = function (request, reply) {
  var msg = _.extend(request.payload, {cmd: 'search_bounding_box', role: 'cd-dojos'});
  reply.act(msg);
};

exports.register.attributes = {
  name: 'api-dojos'
};
