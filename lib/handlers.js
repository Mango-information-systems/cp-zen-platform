
"use strict"

var _ = require('lodash');

module.exports = function(server) {

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

  return {
    handleGet: function (cmd, param) {
      return function (request, reply) {
        doAct(request, reply, cmd, param);
      };
    },

    handlePost: function (cmd, param) {
      return function (request, reply) {
        doAct(request, reply, cmd, param);
      };
    },

    handlePostWithUser: function (cmd, param) {
      return function (request, reply) {
        var token = request.state['seneca-login'];
        if (!token) return reply('Not logged in').code(401);

        server.methods.validateLogin(request.seneca, token, function (err, user, code) {
          if (err) return reply('Unexpected error: ' + err).code(code || 500);

          doAct(request, reply, cmd, param, user);
        });
      };
    }
  };
};