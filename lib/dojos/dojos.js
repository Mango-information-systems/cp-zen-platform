'use strict';

var _ = require('lodash');
var cacheTimes = require('../../web/config/cache-times');

exports.register = function (server, options, next) {
  // TODO - set basePath properly..
  options = _.extend({ basePath: '/api/2.0' }, options);

  var handlers = require('../handlers.js')(server, 'cd-dojos');

  server.route([{
    method: 'GET',
    path: options.basePath + '/countries',
    handler: handlers.handleGet('list_countries'),
    config: {
      cache: {
        expiresIn: cacheTimes.long
      }
    }
  }, {
    method: 'GET',
    path: options.basePath + '/get_dojo_config',
    handler: handlers.handleGet('get_dojo_config')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/search_bounding_box',
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
    path: options.basePath + '/dojo_create',
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
    path: options.basePath + '/dojos_by_country',
    handler: handlers.handlePost('dojos_by_country')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos_state_count/{country}',
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
    path: options.basePath + '/dojos/my_dojos',
    handler: handlers.handlePostWithUser('my_dojos')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/{id}',
    handler: handlers.handleGet('load', 'id')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/bulk_update',
    handler: handlers.handlePostWithUser('bulk_update')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/bulk_delete',
    handler: handlers.handlePostWithUser('bulk_delete')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/stats',
    handler: handlers.handlePostWithUser('get_stats')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/save_dojo_lead',
    handler: handlers.handlePostWithUser('save_dojo_lead')
  }, {
    method: 'PUT',
    path: options.basePath + '/dojos/update_dojo_lead/{id}',
    handler: handlers.handlePostWithUser('update_dojo_lead', 'id')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/user_dojo_lead/{id}',
    handler: handlers.handleGet('load_user_dojo_lead', 'id')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/dojo_lead/{id}',
    handler: handlers.handlePostWithUser('load_dojo_lead', 'id')
  }, {
    method: 'GET',
    path: options.basePath + '/load_setup_dojo_steps',
    handler: handlers.handlePostWithUser('load_setup_dojo_steps')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/users',
    handler: handlers.handlePostWithUser('load_usersdojos')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/search_dojo_leads',
    handler: handlers.handlePostWithUser('search_dojo_leads')
  }, {
    method: 'GET',
    path: options.basePath + '/uncompleted_dojos',
    handler: handlers.handlePostWithUser('uncompleted_dojos')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/load_dojo_users',
    handler: handlers.handlePostWithUser('load_dojo_users')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/generate_user_invite_token',
    handler: handlers.handlePostWithUser('generate_user_invite_token')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/accept_user_invite',
    handler: handlers.handlePostWithUser('accept_user_invite')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/request_user_invite',
    handler: handlers.handlePostWithUser('request_user_invite')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/accept_user_request',
    handler: handlers.handlePostWithUser('accept_user_request')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/dojos_for_user/{id}',
    handler: handlers.handleGet('dojos_for_user', 'id')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/save_usersdojos',
    handler: handlers.handlePostWithUser('save_usersdojos')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/remove_usersdojos/{userId}/{dojoId}',
    handler: handlers.handlePostWithUser('remove_usersdojos', ['userId', 'dojoId'])
  }, {
    method: 'POST',
    path: options.basePath + '/get_user_permissions',
    handler: handlers.handleGet('get_user_permissions')
  }, {
    method: 'GET',
    path: options.basePath + '/get_user_permissions',
    handler: handlers.handleGet('get_user_permissions')
  }, {
    method: 'GET',
    path: options.basePath + '/get_user_types',
    handler: handlers.handleGet('get_user_types')
  }, {
    method: 'POST',
    path: options.basePath + '/update_founder',
    handler: handlers.handlePostWithUser('update_founder')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/search_nearest_dojos',
    handler: handlers.handlePost('search_nearest_dojos')
  }, {
    method: 'POST',
    path: options.basePath + '/places',
    handler: handlers.handlePost('list_places')
  }, {
    method: 'GET',
    path: options.basePath + '/continents_lat_long',
    handler: handlers.handleGet('continents_lat_long')
  }, {
    method: 'GET',
    path: options.basePath + '/countries_lat_long',
    handler: handlers.handleGet('countries_lat_long')
  }, {
    method: 'GET',
    path: options.basePath + '/continent_codes',
    handler: handlers.handleGet('continent_codes')
  }, {
    method: 'GET',
    path: options.basePath + '/countries_continents',
    handler: handlers.handleGet('countries_continents')
  }]);

  next();
};

exports.register.attributes = {
  name: 'api-dojos'
};
