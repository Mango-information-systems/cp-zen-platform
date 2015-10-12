'use strict';

var _ = require('lodash');
var joi = require('joi');

exports.register = function (server, options, next) {
  // TODO - set basePath properly..
  options = _.extend({ basePath: '/api/2.0' }, options);

  var handlers = require('./handlers.js')(server, 'cd-events');

  // TODO - review API structure - should all be /events!!

  server.route([{
    method: 'POST',
    path: options.basePath + '/save-event',
    handler: handlers.handlePostWithUser('saveEvent'),
    config: {
      validate: {
        params: {
          eventId: joi.string(),
          eventInfo: joi.object()
        }
      }
    }
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
    handler: handlers.handleGetWithUser('loadEventApplications', 'eventId')
  }, {
    method: 'POST',
    path: options.basePath + '/events/applications/search',
    handler: handlers.handlePost('searchApplications')
  }, {
    method: 'DELETE',
    path: options.basePath + '/events/applications/{eventId}/{applicationId}',
    handler: handlers.handleDeleteWithUser('deleteApplication')
  }, {
    method: 'POST',
    path: options.basePath + '/events/applications',  // TODO - bad API naming
    handler: handlers.handlePostWithUser('saveApplication')
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

  next();
};

exports.register.attributes = {
  name: 'api-events'
};
