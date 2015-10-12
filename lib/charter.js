'use strict';

var _ = require('lodash');

exports.register = function (server, options, next) {
  // TODO - set basePath properly..
  options = _.extend({ basePath: '/api/2.0' }, options);

  var handlers = require('./handlers.js')(server, 'cd-charter');

  server.route([{
    method: 'GET',
    path: options.basePath + '/charter',
    handler: handlers.handleGet('load')
  }]);

  next();
};

exports.register.attributes = {
  name: 'api-charter'
};
