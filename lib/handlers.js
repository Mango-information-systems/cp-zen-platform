
"use strict"

var _ = require('lodash');
var debug = require('debug')('cp-zen-platform:handlers');

module.exports = function(server, role) {

  function doAct (request, reply, cmd, param, user) {
    var msg = _.extend({cmd: cmd, role: role}, {locality: server.methods.locality(request)});
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

    debug('doAct', msg);
    reply.act(msg);
  }

  var handler = function (cmd, param) {
    return function (request, reply) {
      doAct(request, reply, cmd, param);
    };
  }

  var handlerWithCdfAdmin = function (cmd, param) {
    return handlerWithUser(cmd, param, {checkCdfAdmin: true});
  }

  var handlerWithUser = function (cmd, param, opts) {
    return function (request, reply) {
      var token = request.state['seneca-login'];
      if (!token) return reply('Not logged in').code(401);

      server.methods.validateLogin(request.seneca, token, function (err, user, code) {
        if (err) return reply('Unexpected error: ' + err).code(code || 500);

        if (opts && opts.checkCdfAdmin === true) {
          var roles = _.deepHas(user, 'user.user.roles') ? user.user.roles : [];
          if (!_.contains(roles, 'cdf-admin')) {
            // Note: a 200 status code is still returned here (should be 403 by right)
            return reply({ok: false, why: 'You must be a cdf admin to access this data'});
          }
        }

        doAct(request, reply, cmd, param, user);
      });
    };
  }

  return {
    handleGet: handler,
    handleGetWithUser: handlerWithUser,
    handleGetWithCdfAdmin: handlerWithCdfAdmin,
    handlePost: handler,
    handlePostWithUser: handlerWithUser
  };
};