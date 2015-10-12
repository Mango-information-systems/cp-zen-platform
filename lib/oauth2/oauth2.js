'use strict';

var _ = require('lodash');

exports.register = function (server, options, next) {
  // TODO - set basePath properly..
  options = _.extend({ basePath: '/api/2.0' }, options);

  var handlers = require('../handlers.js')(server, 'cd-oauth2');

  server.route([{
    method: 'GET',
    path: options.basePath + '/oauth2/authorize',
    handler: handlers.handleGet('authorize')
  }, {
    method: 'POST',
    path: options.basePath + '/oauth2/token',
    handler: handlers.handlePost('token')
  }, {
    method: 'GET',
    path: options.basePath + '/oauth2/profile',
    handler: handlers.handleGet('profile')
  }]);

  next();
};

exports.register.attributes = {
  name: 'api-oauth2'
};
