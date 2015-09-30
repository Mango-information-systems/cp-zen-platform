'use strict';

var controller = module.exports = [
  {
    method: 'GET',
    path: '/{lang}/',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/login',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/login',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/register',
    handler: function (request, reply) { 
      reply.view('index', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/register',
    handler: function (request, reply) { 
      reply.view('index', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/create-dojo',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/create-dojo',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/start-dojo',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/start-dojo',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/charter',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/charter',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/dojo-list-index',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/dojo-list-index',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/terms-and-conditions',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/terms-and-conditions',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },

  {	    
    method: 'GET',
    path: '/{lang}/dojo/{id}/{alpha2*}',
    handler: function (request, reply) {
      if (request.params.alpha2) {
        reply.view('index', request.locals);
      }
      else {
        reply.view('dashboard/index');
      }
    }
  },

  {     
    method: 'GET',
    path: '/{lang}/dojo/{legacyId}',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/accept_dojo_user_invitation/{dojoId}/{userInviteToken}',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/accept_dojo_user_request/{userId}/{userInviteToken}', 
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/accept_dojo_user_request/{userId}/{userInviteToken}', 
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/accept-parent-guardian-request/{parentProfileId}/{childProfileId}/{inviteToken}', 
    handler: function (request, reply){
      reply.view('index', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/accept-parent-guardian-request/{parentProfileId}/{childProfileId}/{inviteToken}', 
    handler: function (request, reply){
      reply.view('index', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/profile/{userId}',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/profile/{userId}',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/reset_password/{token}',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/reset_password/{token}',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/badges',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/badges',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/templates/login',
    handler: function (request, reply) {
      reply.view('accounts/login', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/templates/login',
    handler: function (request, reply) {
      reply.view('accounts/login', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/templates/register',
    handler: function (request, reply) {
      reply.view('accounts/register', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/templates/register',
    handler: function (request, reply) {
      reply.view('accounts/register', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/templates/terms-and-conditions',
    handler: function (request, reply) {
      reply.view('accounts/terms-and-conditions', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/templates/terms-and-conditions',
    handler: function (request, reply) {
      reply.view('accounts/terms-and-conditions', request.locals);
    }
  },

  {
    method: 'GET',
    path: '/{lang}/templates/reset_password',
    handler: function (request, reply) {
      reply.view('accounts/reset_password', request.locals);
    }
  },
  {
    method: 'GET',
    path: '/templates/reset_password',
    handler: function (request, reply) {
      reply.view('accounts/reset_password', request.locals);
    }
  }
  
];
