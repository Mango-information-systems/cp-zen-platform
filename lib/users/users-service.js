'use strict';

var _ = require('lodash');
var cacheTimes = require('../../web/config/cache-times');

exports.register = function (server, options, next) {
  // TODO - set basePath properly..
  options = _.extend({ basePath: '/api/2.0/users' }, options);

  var handlers = require('../handlers.js')(server, 'cd-users');

  server.route([{
    method: 'POST',
    path: options.basePath + '/login',
    handler: handleLogin
  }, {
    method: 'POST',
    path: options.basePath + '/logout',
    handler: handleLogout
  }, {
    method: 'GET',
    path: options.basePath + '/instance',
    handler: handleInstance
  }, {
    method: 'POST',
    path: options.basePath + '/list',
    handler: handlers.handlePost('list')
  }, {
    method: 'POST',
    path: options.basePath + '/register',
    handler: handleRegister
  }, {
    method: 'POST',
    path: options.basePath + '/promote/{id}',
    handler: handlers.handlePost('promote', 'id')
  }, {
    method: 'POST',
    path: options.basePath + '/emails',
    handler: handlers.handlePost('get_users_by_emails')
  }, {
    method: 'POST',
    path: options.basePath + '/update/{id}',
    handler: handlers.handlePost('update', 'id')
  }, {
    method: 'GET',
    path: options.basePath + '/load/{id}',
    handler: handlers.handleGet('load')
  }, {
    method: 'GET',
    path: options.basePath + '/init_user_types',
    handler: handlers.handleGet('get_init_user_types'),
    config: {
      cache: {
        expiresIn: cacheTimes.long
      }
    }
  }, {
    method: 'POST',
    path: options.basePath + '/isChampion',
    handler: handlers.handlePost('is_champion')
  }, {
    method: 'POST',
    path: options.basePath + '/reset_password',
    handler: handlers.handlePost('reset_password')
  }, {
    method: 'GET',
    path: options.basePath + '/champions_for_user/{userId}',
    handler: handlers.handleGet('load_champions_for_user', 'userId')
  }, {
    method: 'GET',
    path: options.basePath + '/dojo_admins_for_user/{userId}',
    handler: handlers.handleGet('load_dojo_admins_for_user', 'userId')
  }, {
    method: 'GET',
    path: options.basePath + '/kpi/kpi_number_of_youths_registered',
    handler: handlers.handleGet('kpi_number_of_youths_registered')
  }, {
    method: 'GET',
    path: options.basePath + '/kpi/number_of_champions_and_mentors_registered',
    handler: handlers.handleGet('number_of_champions_and_mentors_registered')
  }, {
    method: 'GET',
    path: options.basePath + '/kpi/number_of_youth_females_registered',
    handler: handlers.handleGet('number_of_youth_females_registered')
  }
]);

  function handleLogin (request, reply) {
    var args = {email: request.payload.email, password: request.payload.password};
    var msg = _.extend({role: 'user', cmd: 'login', auto: true}, args);
    request.seneca.act(msg, function (err, out) {
      if (err) return reply(err);
      reply(out).state('seneca-login', out.login.id);
    });
  }

  function handleInstance (request, reply) {
    var token = request.state['seneca-login'];
    if (!token) {
      return reply({user: null, login: null, ok: true});
    }

    server.methods.validateLogin(request.seneca, token, function (err, resp, code) {
      if (err) return reply('Unexpected error: ' + err).code(code || 500);

      var user = resp.user && request.seneca.util.clean(resp.user) || null;
      var login = resp.login && request.seneca.util.clean(resp.login) || null;

      if (user) {
        delete user.pass;
        delete user.salt;
        delete user.active;
        delete user.accounts;
        delete user.confirmcode;
      }

      reply({user: user, login: login, ok: true});
    });
  }

  function handleLogout (request, reply) {
    var token = request.state['seneca-login'];
    if (!token) {
      return reply({ok: true});
    }

    var msg = {role: 'user', cmd: 'logout', token: token};
    request.seneca.act(msg, function (err, resp) {
      if (err) return reply(err);
      reply(resp).state('seneca-login', '', {ttl: 1});
    });
  }

  function handleRegister (request, reply) {
    var msg = _.extend({role: 'cd-users', cmd: 'register'}, request.payload);
    request.seneca.act(msg, function (err, resp) {
      if (err) return reply(err).code(500);
      if (resp.user) {
        delete resp.user.pass;
        delete resp.user.salt;
        delete resp.user.active;
        delete resp.user.accounts;
        delete resp.user.confirmcode;
      }
      reply(resp);
    });
  }

  next();
};

exports.register.attributes = {
  name: 'api-cd-users-service'
};
