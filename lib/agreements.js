'use strict';

var _ = require('lodash');

exports.register = function (server, options, next) {
  // TODO - set basePath properly..
  options = _.extend({ basePath: '/api/2.0' }, options);

  var handlers = require('./handlers.js')(server, 'cd-agreements');

  server.route([{
    method: 'POST',
    path: options.basePath + '/agreements',
    handler: handlers.handlePost('save')
  }, {
    method: 'POST',
    path: options.basePath + '/agreements/list-by-ids',
    handler: handlers.handlePost('get_agreements')
  }, {
    method: 'POST',
    path: options.basePath + '/agreements/count',
    handler: handlers.handlePost('count')
  }, {
    method: 'GET',
    path: options.basePath + '/agreements/{id}',
    handler: handlers.handleGet('load_user_agreement', 'id')
  }]);

  next();
};

exports.register.attributes = {
  name: 'api-agreements'
};
