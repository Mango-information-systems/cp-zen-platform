'use strict';

var _ = require('lodash');
var cacheTimes = require('../../web/config/cache-times');

exports.register = function (server, options, next) {
  // TODO - set basePath properly..
  options = _.extend({ basePath: '/api/2.0' }, options);

  var handlers = require('../handlers.js')(server, 'cd-profiles');

  // TODO - much more work to be done around uploading profile images etc - see cd-profiles!!!!

  server.route([{
    method: 'POST',
    path: options.basePath + '/profiles/user_profile_data',
    handler: handlers.handlePostWithUser('user_profile_data')
  }, {
    method: 'POST',
    path: options.basePath + '/profiles/create',
    handler: handlers.handlePostWithUser('create')
  }, {
    method: 'POST',
    path: options.basePath + '/profiles/youth/create',
    handler: handlers.handlePostWithUser('save-youth-profile')
  }, {
    method: 'PUT',
    path: options.basePath + '/profiles/youth/update',
    handler: handlers.handlePostWithUser('update-youth-profile')
  }, {
    method: 'POST',
    path: options.basePath + '/profiles/invite-parent-guardian',
    handler: handlers.handlePostWithUser('invite-parent-guardian')
  }, {
    method: 'POST',
    path: options.basePath + '/profiles/accept-parent-guardian',
    handler: handlers.handlePostWithUser('accept-parent-invite')
  }, {
    method: 'POST',
    path: options.basePath + '/profiles/hidden-fields',
    handler: handlers.handlePostWithUser('load_hidden_fields'),
    config: {
      cache: {
        expiresIn: cacheTimes.long
      }
    }
  }, {
    method: 'POST',
    path: options.basePath + '/profiles/change-avatar',
    handler: handlers.handlePostWithUser('change_avatar')
  }, {
    method: 'GET',
    path: options.basePath + '/profiles/{id}/avatar',
    handler: handlers.handleGetWithUser('get_avatar', 'id')
  }, {
    method: 'GET',
    path: options.basePath + '/profiles/{id}/avatar_img',
    handler: handlers.handleGetWithUser('get_avatar_img', 'id')
  }, {
    method: 'GET',
    path: options.basePath + '/profiles/{id}',
    handler: handlers.handleGetWithUser('get_avatar', 'id')
  }, {
    method: 'GET',
    path: options.basePath + '/profiles/parents_for_user/{userId}',
    handler: handlers.handleGetWithUser('load_parents_for_user', 'userId')
  }, {
    method: 'POST',
    path: options.basePath + '/profiles/invite_ninja',
    handler: handlers.handlePostWithUser('invite_ninja')
  }, {
    method: 'POST',
    path: options.basePath + '/profiles/approve_invite_ninja',
    handler: handlers.handlePostWithUser('approve_invite_ninja')
  }, {
    method: 'GET',
    path: options.basePath + '/profiles/ninjas_for_user/{userId}',
    handler: handlers.handleGetWithUser('ninjas_for_user', 'userId')
  }]);

  next();
};

exports.register.attributes = {
  name: 'api-profiles'
};
