'use strict';

var _ = require('lodash');
var cacheTimes = require('../../web/config/cache-times');

exports.register = function (server, options, next) {
  // TODO - set basePath properly..
  options = _.extend({ basePath: '/api/2.0' }, options);

  server.route([{
    method: 'GET',
    path: options.basePath + '/countries',
    handler: handleGet('list_countries'),
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
    path: options.basePath + '/dojos/search',
    handler: handlePost('search')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/create',
    handler: handlePostWithUser('create')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/update/{id}',
    handler: handlePostWithUser('update', 'id')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/delete/{id}',
    handler: handlePostWithUser('delete', 'id')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos_by_country',
    handler: handlePost('dojos_by_country')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos_state_count/{country}',
    handler: handleGet('dojos_state_count', 'country')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/list',
    handler: handlePost('list')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos',
    handler: handlePost('list')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/my_dojos',
    handler: handlePostWithUser('my_dojos')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/{id}',
    handler: handleGet('load', 'id')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/bulk_update',
    handler: handlePostWithUser('bulk_update')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/bulk_delete',
    handler: handlePostWithUser('bulk_delete')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/stats',
    handler: handlePostWithUser('get_stats')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/save_dojo_lead',
    handler: handlePostWithUser('save_dojo_lead')
  }, {
    method: 'PUT',
    path: options.basePath + '/dojos/update_dojo_lead',
    handler: handlePostWithUser('update_dojo_lead')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/user_dojo_lead/{id}',
    handler: handleGet('load_user_dojo_lead', 'id')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/dojo_lead/{id}',
    handler: handlePostWithUser('load_dojo_lead', 'id')
  }, {
    method: 'GET',
    path: options.basePath + '/load_setup_dojo_steps',
    handler: handlePostWithUser('load_setup_dojo_steps')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/users',
    handler: handlePostWithUser('load_usersdojos')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/search_dojo_leads',
    handler: handlePostWithUser('search_dojo_leads')
  }, {
    method: 'GET',
    path: options.basePath + '/uncompleted_dojos',
    handler: handlePostWithUser('uncompleted_dojos')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/load_dojo_users',
    handler: handlePostWithUser('load_dojo_users')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/generate_user_invite_token',
    handler: handlePostWithUser('generate_user_invite_token')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/accept_user_invite',
    handler: handlePostWithUser('accept_user_invite')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/request_user_invite',
    handler: handlePostWithUser('request_user_invite')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/accept_user_request',
    handler: handlePostWithUser('accept_user_request')
  }, {
    method: 'GET',
    path: options.basePath + '/dojos/dojos_for_user/{id}',
    handler: handleGet('dojos_for_user', 'id')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/save_usersdojos',
    handler: handlePostWithUser('save_usersdojos')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/remove_usersdojos/{userId}/{dojoId}',
    handler: handlePostWithUser('remove_usersdojos', ['userId', 'dojoId'])
  }, {
    method: 'POST',
    path: options.basePath + '/get_user_permissions',
    handler: handleGet('get_user_permissions')
  }, {
    method: 'GET',
    path: options.basePath + '/get_user_permissions',
    handler: handleGet('get_user_permissions')
  }, {
    method: 'GET',
    path: options.basePath + '/get_user_types',
    handler: handleGet('get_user_types')
  }, {
    method: 'POST',
    path: options.basePath + '/update_founder',
    handler: handlePostWithUser('update_founder')
  }, {
    method: 'POST',
    path: options.basePath + '/dojos/search_nearest_dojos',
    handler: handlePost('search_nearest_dojos')
  }, {
    method: 'POST',
    path: options.basePath + '/places',
    handler: handlePost('list_places')
  }, {
    method: 'GET',
    path: options.basePath + '/continents_lat_long',
    handler: handleGet('continents_lat_long')
  }, {
    method: 'GET',
    path: options.basePath + '/countries_lat_long',
    handler: handleGet('countries_lat_long')
  }, {
    method: 'GET',
    path: options.basePath + '/continent_codes',
    handler: handleGet('continent_codes')
  }, {
    method: 'GET',
    path: options.basePath + '/countries_continents',
    handler: handleGet('countries_continents')
  }]);

  function doAct (request, reply, cmd, param, user) {
    var msg = _.extend({cmd: cmd, role: 'cd-dojos'}, {locality: server.methods.locality(request)});
    if (request.payload) {
      msg = _.extend(msg, request.payload);
    }

    if (param) {
      var paramsMsg = {};
      var params = _.isArray(param) ? param : [param];
      _.each(params, function (p) {
        paramsMsg[p] = request.params[p];
      });
      msg = _.extend(msg, paramsMsg);
    }

    if (user) {
      msg = _.extend(msg, user);
    }

    reply.act(msg);
  }

  function handleGet (cmd, param) {
    return function (request, reply) {
      doAct(request, reply, cmd, param);
    };
  }

  function handlePost (cmd, param) {
    return function (request, reply) {
      doAct(request, reply, cmd, param);
    };
  }

  function handlePostWithUser (cmd, param) {
    return function (request, reply) {
      var token = request.state['seneca-login'];
      if (!token) return reply('Not logged in').code(401);

      server.methods.validateLogin(request.seneca, token, function (err, user, code) {
        if (err) return reply('Unexpected error: ' + err).code(code || 500);

        doAct(request, reply, cmd, param, user);
      });
    };
  }

  next();
};

exports.register.attributes = {
  name: 'api-dojos'
};
