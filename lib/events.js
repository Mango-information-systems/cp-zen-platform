'use strict';

var _ = require('lodash');
var joi = require('joi');

exports.register = function (server, options, next) {
  options = _.extend({ basePath: '/api/2.0' }, options);
  var handlers = require('./handlers.js')(server, 'cd-events');

  // TODO - review API structure - should all be /events!!

  server.route([{
    method: 'POST',
    path: options.basePath + '/save-event',
    handler: validateEvent('saveEvent')
  }, {
    method: 'GET',
    path: options.basePath + '/events/{id}',
    handler: handlers.handleGet('getEvent', 'id')
  }, {
    method: 'POST',
    path: options.basePath + '/listEvents',
    handler: handlers.handlePost('events')
  }, {
    method: 'POST',
    path: options.basePath + '/events/search',
    handler: handlers.handlePost('searchEvents')
  }, {
    method: 'GET',
    path: options.basePath + '/events/applications/{eventId}',
    handler: validateEvent('loadEventApplications')
  }, {
    method: 'POST',
    path: options.basePath + '/events/applications/search',
    handler: handlers.handlePost('searchApplications')
  }, {
    method: 'DELETE',
    path: options.basePath + '/events/applications/{eventId}/{applicationId}',
    handler: deleteApplicationHandler
  }, {
    method: 'POST',
    path: options.basePath + '/events/applications',  // TODO - bad API naming
    handler: saveApplicationHandler
  }, {
    method: 'POST',
    path: options.basePath + '/events/user-dojos-events',
    handler: handlers.handlePostWithUser('userDojosEvents')
  }, {
    method: 'GET',
    path: options.basePath + '/events/tickets/types',
    handler: handlers.handleGet('ticketTypes')
  }, {
    method: 'GET',
    path: options.basePath + '/events/export-guest-list/{eventId}',
    handler: exportGuestListHandler
  }, {
    method: 'POST',
    path: options.basePath + '/events/search_sessions',
    handler: handlers.handlePost('searchSessions')
  }, {
    method: 'POST',
    path: options.basePath + '/events/bulk_apply_applications',
    handler: handlers.handlePost('bulkApplyApplications')
  }, {
    method: 'POST',
    path: options.basePath + '/events/update_application_attendance',
    handler: handlers.handlePost('updateApplicationAttendance')
  }, {
    method: 'POST',
    path: options.basePath + '/events/cancel_session',
    handler: handlers.handlePost('cancelSession')
  }]);

  function exportGuestListHandler (request, reply) {
    var eventId = request.params.eventId;
    request.seneca.act({role: 'cd-events', cmd: 'exportGuestList', eventId: eventId}, function (err, obj) {
      if (err) return reply('Fatal error: ' + err).code(500);
      reply.setHeader('Content-Type', 'application/csv');
      reply.setHeader('Content-Disposition', 'attachment; filename=event-guest-list.csv');
      reply.setHeader('x-download-options');
      reply.setHeader('x-content-type-options');
      reply.write(obj.data);
      reply.end();
    });
  }

  function validateEvent (cmd) {
    return function (request, reply) {
      var user = request.user;
      var eventInfo = request.payload.eventInfo;
      var eventId = request.payload.eventId;

      if (!user) {
        return reply({ok: false, why: 'User must exist'});
      }

      if (!eventId && !eventInfo) {
        return reply({ok: false, why: 'EventId or eventInfo must exist'});
      }

      if (eventInfo) {
        var dojoId = eventInfo.dojoId;
        return checkUserPermissionsAndAct(user, dojoId, cmd, request, reply);
      }

      // Get dojo id
      getEventById(request, eventId, function (err, event) {
        if (err) return reply('Error getting event: ' + eventId + ' - ' + err).code(500);
        checkUserPermissionsAndAct(user, event.dojoId, cmd, request, reply);
      });
    }
  }

  function saveApplicationHandler (request, reply) {
    var user = request.user;
    var application = request.payload.application;

    if (!application) return reply({ok: false, why: 'Application must exist'});

    var eventId = application.eventId;
    getEventById(request, eventId, function (err, event) {
      if (err) return reply('Error getting event: ' + eventId + ' - ' + err).code(500);
      checkUserPermissionsAndAct(user, event.dojoId, 'saveApplication', request, reply);
    });
  }

  function deleteApplicationHandler (request, reply) {
    var user = request.user;
    var applicationId = request.payload.applicationId;
    var eventId = request.payload.eventId;

    if (!applicationId || !eventId) return reply({ok: false, why: 'Application Id or Event Id missing'});

    getEventById(request, eventId, function (err, event) {
      if (err) return reply('Error getting event: ' + eventId + ' - ' + err).code(500);
      checkUserPermissionsAndAct(user, event.dojoId, 'deleteApplication', request, reply);
    });
  }

  function checkUserPermissionsAndAct (user, dojoId, cmd, request, reply) {
    checkUserPermissions(request, user.id, dojoId, function (err, hasPermission) {
      if (err)  return reply(err).code(500);
      handlers.doAct(request, reply, cmd, ['eventId', 'eventInfo', 'applicationId'], user);
    });
  }

  function getEventById (request, eventId, done) {
    seneca.act({
      role: 'cd-events',
      cmd: 'getEvent',
      id: eventId
    }, function (err, event) {
      if (err) {
        return done(err);
      }

      if (!event) {
        return done(new Error('Couldn\'t get event'));
      }

      return done(null, event);
    });
  }

  // Check that user is a member, champion and ticketing admin
  function checkUserPermissions (request, userId, dojoId, done) {
    request.seneca.act({
      role: 'cd-dojos',
      cmd: 'load_usersdojos',
      query: {
        userId: userId,
        dojoId: dojoId
      }
    }, function (err, result) {
      if (err) {
        return done(err);
      }

      if (_.isEmpty(result)) {
        return done(null, {ok: false, why: 'No permission, user is not a member'});
      }

      var userDojoEntity = result[0];
      var userPermissions = userDojoEntity.userPermissions;
      var isTicketingAdmin = _.find(userPermissions, function (userPermission) {
        return userPermission.name === 'ticketing-admin';
      });

      if (!isTicketingAdmin) {
        return done(null, {ok: false, why: 'No permission, user is not a ticketing admin'});
      }

      // Has permission
      return done(null, true);
    });
  }



  next();
};

exports.register.attributes = {
  name: 'api-events'
};
