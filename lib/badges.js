'use strict';

var _ = require('lodash');

exports.register = function (server, options, next) {
  options = _.extend({ basePath: '/api/2.0' }, options);
  var handlers = require('./handlers.js')(server, 'cd-badges');

  server.route([{
    method: 'GET',
    path: options.basePath + '/badges',
    handler: handlers.handleGet('listBadges')
  }, {
    method: 'GET',
    path: options.basePath + '/badges/{slug}',
    handler: handlers.handleGet('getBadge')
  }, {
    method: 'POST',
    path: options.basePath + '/badges/applications',
    handler: handlers.handlePostWithUser('sendBadgeApplication')
  }, {
    method: 'POST',
    path: options.basePath + '/badges/accept',
    handler: handlers.handlePostWithUser('acceptBadge')
  }, {
    method: 'GET',
    path: options.basePath + '/badges/user/{userId}',
    handler: handlers.handleGetWithUser('loadUserBadges', 'userId')
  }, {
    method: 'GET',
    path: options.basePath + '/badges/categories',
    handler: handlers.handleGet('loadBadgeCategories')
  }, {
    method: 'POST',
    path: options.basePath + '/badges/code',
    handler: handlers.handlePostWithUser('loadBadgeByCode')
  }, {
    method: 'GET',
    path: options.basePath + '/badges/claim',
    handler: handlers.handleGetWithUser('claimBadge')
  }, {
    method: 'GET',
    path: options.basePath + '/badges/export',
    handler: handlers.handleGetWithUser('exportBadges')
  }, /*{  // TODO - this looks like it's not used - safe to remove?
    method: 'GET',
    path: options.basePath + '/verify_badge/{userId}/{badgeId}/assertion',
    handler: handlers.handleGetWithUser('verifyBadge', ['userId', 'badgeId'])
  }, */{
    method: 'GET',
    path: options.basePath + 'badges/kpi/number_of_badges_awarded',
    handler: handlers.handleGetWithCdfAdmin('kpiNumberOfBadgesAwarded')
  }, {
    method: 'GET',
    path: options.basePath + 'badges/kpi/number_of_badges_published',
    handler: handlers.handleGetWithCdfAdmin('kpiNumberOfBadgesPublished')
  }]);

  next();
};

exports.register.attributes = {
  name: 'api-badges'
};
