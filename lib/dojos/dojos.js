'use strict';

var _ = require('lodash');
var cacheTimes = require('../../web/config/cache-times');

exports.register = function (server, options, next) {
  // TODO - set basePath properly..
  options = _.extend({ basePath: '/api/2.0' }, options);

  server.route([{
    method: 'GET',
    path: options.basePath + '/countries',
    handler: handleGet('countries'),
    config: {
      cache: {
        expiresIn: cacheTimes.long
      }
    }
  }, {
    method: 'GET',
    path: options.basePath + '/get_dojo_config',
    handler: handleGet('get_dojo_config')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/search_bounding_box',
    handler: handlePost('search_bounding_box')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/find',
    handler: handlePost('find')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos_by_country',
    handler: handlePost('dojos_by_country')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/list',
    handler: handlePost('list')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos',
    handler: handlePost('list')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/load/{id}',
    handler: load
  }]);

  next();
};

var handleGet = function (cmd) {
  return function (request, reply) {
    reply.act({cmd: cmd, role: 'cd-dojos'});
  };
};

var handlePost = function (cmd) {
  return function (request, reply) {
    var msg = _.extend(request.payload, {cmd: cmd, role: 'cd-dojos'});
    reply.act(msg);
  };
};

var load = function (request, reply) {
  var msg = _.extend({id: request.params.id, cmd: 'load', role: 'cd-dojos'});
  reply.act(msg);
};

exports.register.attributes = {
  name: 'api-dojos'
};
