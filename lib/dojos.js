'use strict';

var _ = require('lodash');
var cacheTimes = require('../web/config/cache-times');

exports.register = function (server, options, next) {
  options = _.extend({ basePath: '/api/2.0' }, options);
  var handlers = require('./handlers.js')(server, 'cd-dojos');

  server.route([{
    method: 'GET',
    path: options.basePath + '/dojos/config',
    handler: handlers.handleGet('get_dojo_config')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/search-bounding-box',
    handler: handlers.handlePost('search_bounding_box')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/find',
    handler: handlers.handlePost('find')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/search',
    handler: handlers.handlePost('search')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/create',
    handler: handlers.handlePostWithUser('create')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/update/{id}',
    handler: handlers.handlePostWithUser('update', 'id')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/delete/{id}',
    handler: handlers.handlePostWithUser('delete', 'id')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/by-country',
    handler: handlers.handlePost('dojos_by_country')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/state-count/{country}',
    handler: handlers.handleGet('dojos_state_count', 'country')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/list',
    handler: handlers.handlePost('list')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos',
    handler: handlers.handlePost('list')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/my-dojos',
    handler: handlers.handlePostWithUser('my_dojos')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/{id}',
    handler: handlers.handleGet('load', 'id')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/bulk-update',
    handler: handlers.handlePostWithUser('bulk_update')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/bulk-delete',
    handler: handlers.handlePostWithUser('bulk_delete')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/stats',
    handler: handlers.handlePostWithUser('get_stats')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/save-dojo-lead',
    handler: handlers.handlePostWithUser('save_dojo_lead')
  }, {
    method: 'PUT',
    path: options.basePath + '/dojos/update-dojo-lead/{id}',
    handler: handlers.handlePostWithUser('update_dojo_lead', 'id')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/user-dojo=lead/{id}',
    handler: handlers.handleGetWithUser('load_user_dojo_lead', 'id')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/dojo-lead/{id}',
    handler: handlers.handleGetWithUser('load_dojo_lead', 'id')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/setup-steps',
    handler: handlers.handleGetWithUser('load_setup_dojo_steps')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/users',
    handler: handlers.handlePost('load_usersdojos')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/search-dojo-leads',
    handler: handlers.handlePost('search_dojo_leads')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/uncompleted',
    handler: handlers.handlePost('uncompleted_dojos')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/load-dojo-users',
    handler: handlers.handlePost('load_dojo_users')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/generate-user-invite-token',
    handler: handlers.handlePost('generate_user_invite_token')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/accept-user-invite',
    handler: handlers.handlePost('accept_user_invite')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/request-user-invite',
    handler: handlers.handlePost('request_user_invite')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/accept-user-request',
    handler: handlers.handlePost('accept_user_request')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/dojos-for-user/{id}',
    handler: handlers.handleGet('dojos_for_user', 'id')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/save-usersdojos',
    handler: handlers.handlePost('save_usersdojos')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/remove-usersdojos/{userId}/{dojoId}',
    handler: handlers.handlePost('remove_usersdojos', ['userId', 'dojoId'])
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/user-permissions',
    handler: handlers.handleGet('get_user_permissions')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/user-types',
    handler: handlers.handleGet('get_user_types')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/update-founder',
    handler: handlers.handlePostWithUser('update_founder')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/search-nearest-dojos',
    handler: handlers.handlePost('search_nearest_dojos')
  }, {
    method: 'GET',
    path: options.basePath + '/countries',
    handler: handlers.handleGet('list_countries'),
    config: {
      cache: {
        expiresIn: cacheTimes.long
      }
    }
  }, {
    method: 'POST',
    path: options.basePath + '/countries/places',
    handler: handlers.handlePost('list_places')
  }, {
    method: 'GET',
    path: options.basePath + '/countries/continents/lat-long',
    handler: handlers.handleGet('continents_lat_long')
  }, {
    method: 'GET',
    path: options.basePath + '/countries/lat-long',
    handler: handlers.handleGet('countries_lat_long')
  }, {
    method: 'GET',
    path: options.basePath + '/countries/continents/codes',
    handler: handlers.handleGet('continent_codes')
  }, {
    method: 'GET',
    path: options.basePath + '/countries/continents',
    handler: handlers.handleGet('countries_continents')
  }]);

  next();
};

exports.register.attributes = {
  name: 'api-dojos'
};
