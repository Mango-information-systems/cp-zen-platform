'use strict';

exports.start = function () {

if (process.env.NEW_RELIC_ENABLED === "true") require('newrelic');

var env = process.env.NODE_ENV || 'development';

var _ = require('lodash');
var Hapi = require('hapi');
var Blankie = require('blankie');
var Scooter = require('scooter');
var Chairo = require('chairo');
var path = require('path');
var options = require('./options.' + env + '.js');
var locale = require('locale');
var languages = require('./config/languages.js');
var cacheTimes = require('./config/cache-times');
var cuid = require('cuid');
var util = require('util');
var fs = require('fs');

require('./lib/dust-i18n.js');

var availableLocales = new locale.Locales(_.pluck(languages, 'code'));
var server = new Hapi.Server(options.hapi)
var port = process.env.PORT || 8000
var host = process.env.HOSTNAME || 'localhost';
var protocol = process.env.PROTOCOL || 'http';
var hostWithPort = protocol + '://' + host + ':' + port;

function checkHapiPluginError (name) {
  return function (error) {
    if (error) {
      console.error('Failed loading a Hapi plugin: "' + name + '".');
      throw error;
    }
  };
}

// Set up HAPI

server.connection({
  port: port,
  // According to the HTTP spec and Chrome audit tool, Cache-Control headers should match what
  // would be sent for 200 when a 304 (Not Modified) is sent.
  routes: {
    cache: { statuses: [200,304] },
    cors: { origin: [ hostWithPort, 'https://changex.org' ] }
  }
});

server.views({
  engines: { dust: require('hapi-dust') },
  path: path.join(__dirname, './public/templates'),
  partialsPath: path.join(__dirname, './public/templates')
});

server.ext('onPreAuth', function (request, reply) {
  var localesFormReq = (request.state && request.state.NG_TRANSLATE_LANG_KEY && request.state.NG_TRANSLATE_LANG_KEY.replace(/\"/g, ''))
    || request.headers['accept-language'];

  var requestLocales = new locale.Locales(localesFormReq);

  request.locals = {
    context: {
      locality: requestLocales.best(availableLocales).code
    }
  };

  return reply.continue();
});

// Handler for 404/401
server.ext('onPreResponse', function (request, reply) {
  var status = request.response.statusCode;

  if (status !== 404 && status !== 401) {
    return reply.continue();
  }

  return reply.view('errors/404', request.locals);
});

// Handler for 500
server.ext('onPreResponse', function (request, reply) {
  var headerStatus = _.get(request, 'response.statusCode', 500);
  var bodyStatus = _.get(request, 'response.output.payload.statusCode', undefined);

  if (headerStatus !== 500 && bodyStatus !== 500) {
    return reply.continue();
  }

  // Display full error message if not in production environment.
  if (env !== 'production') {
    return reply.continue();
  }

  // Otherwise, give a generic error reply to hide errors in production.
  return reply.view('errors/500', request.locals);
});

// TODO Using stream here causes responses from seneca-web to be buffered, which may impact performance.
//      However, most of them aren't large sized responses, so the benefit of Etag outweighs that penalty.
//      Implementing better streaming support in hapi-etags may be fairly straightforward using Etag in the
//      Trailer rather than Header... - wprl
server.register({ register: require('hapi-etags'), options: { varieties: ['plain', 'buffer', 'stream'] } }, checkHapiPluginError('hapi-etags'));

server.register(Scooter, function (err) {
  checkHapiPluginError('scooter')(err);

  server.register({ register: Blankie, options: {
    childSrc: "'none'",
    connectSrc: "'self' https://*.intercom.io wss://*.intercom.io https://api-ping.intercom.io https://s3.amazonaws.com/",
    defaultSrc: "'none'",
    fontSrc: "'self' http://fonts.gstatic.com https://fonts.gstatic.com",
    frameSrc: "https://www.google.com",
    frameAncestors: "'none'",
    imgSrc: "'self' 'unsafe-eval' 'unsafe-inline' data: *",
    manifestSrc: "'none'",
    mediaSrc: "'none'",
    objectSrc: "'none'",
    reflectedXss: 'block',
    scriptSrc: "'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com http://www.google-analytics.com https://www.google-analytics.com http://www.googletagmanager.com https://www.googletagmanager.com https://maps.gstatic.com https://www.gstatic.com https://widget.intercom.io https://js.intercomcdn.com https://www.google.com https://apis.google.com",
    styleSrc: "'self' 'unsafe-inline' http://fonts.googleapis.com https://fonts.googleapis.com"
  }}, checkHapiPluginError('blankie'));
});

server.register({ register: require('./controllers') }, checkHapiPluginError('CoderDojo controllers'));


// Serve CSS files.
server.register({
  register: require('hapi-less'),
  options: {
    home: path.join(__dirname, './public/css'),
    route: '/css/{filename*}',
    config: { cache: { privacy: 'public', expiresIn: cacheTimes.short } },
    less: { compress: true }
  }
}, checkHapiPluginError('hapi-less'));

if (process.env.HAPI_DEBUG === 'true') {
  var goodLogFile = fs.existsSync('/var/log/zen') ? '/var/log/zen/hapi-zen-platform.log' : '/tmp/hapi-zen-platform.log';
  var goodOptions = {
    opsInterval: 1000,
    requestPayload:true,
    responsePayload:true,
    reporters: [{
      reporter: require('good-file'),
      events: { log: '*', response: '*' },
      config: goodLogFile
    }]
  };

  server.register({ register: require('good'), options: goodOptions }, checkHapiPluginError('Good Logger'));
}

var dojos = require('../lib/dojos/dojos.js')
server.register(dojos, function (err) {
  checkHapiPluginError('dojos')(err);
});

// server method - validate user has logged in ok
var validateLogin = function (seneca, token, cb) {
  seneca.act({role: 'user', cmd:'auth', token: token}, function (err, resp) {
    if (err) return cb(err);
    if (resp.ok === false) return cb(resp.why, null, 403);
    return cb(null, resp);
  });
};

server.method('validateLogin', validateLogin, {});

// Locale related server method
function formatLocaleCode (code) {
  return code.slice(0, 3) + code.charAt(3).toUpperCase() + code.charAt(4).toUpperCase();
}

var locality = function(request) {
  var ngKey;
  if (request.state.NG_TRANSLATE_LANG_KEY) {
    // TODO - shouldn't hapi decode cookies?
    ngKey = decodeURIComponent(request.state.NG_TRANSLATE_LANG_KEY);
    ngKey = ngKey.replace(/\"/g, '');
  }

  var local = ngKey || request.headers['accept-language'];
  if (!local) local = 'en_US';
  local = formatLocaleCode(local);

  return local;
}

server.method('locality', locality, {});

// TODO - what's the ttl on the express cookie??
server.state('seneca-login', {
  ttl: 2 * 24 * 60 * 60 * 1000,     // two days
  path: '/'
});

// Set up Chairo and seneca, then start the server.
server.register({ register: Chairo, options: options }, function (err) {
  checkHapiPluginError('Chairo')(err);

  server.register({
    register: require('chairo-cache'),
    options: { cacheName: 'cd-cache' }
  }, function (err) {
    checkHapiPluginError('chairo-cache')(err);

    var seneca = server.seneca;

    seneca
      .use('ng-web')
      .use(require('../lib/users/user.js'))
      .use('auth')
      .use('user-roles')
      .use('web-access')
      .use(require('../lib/charter/cd-charter.js'))
      .use(require('../lib/dojos/cd-dojos.js'))
      .use(require('../lib/users/cd-users.js'))
      .use(require('../lib/agreements/cd-agreements.js'))
      .use(require('../lib/badges/cd-badges.js'))
      .use(require('../lib/profiles/cd-profiles.js'))
      .use(require('../lib/events/cd-events.js'))
      .use(require('../lib/oauth2/cd-oauth2.js'))
      .use(require('../lib/config/cd-config.js'), options.webclient)
      .use(require('../lib/sys/cd-sys.js'));

    _.each(options.client, function(opts) {
      seneca.client(opts);
    });

    // // Potentially useful extra logging.

    // seneca.logroute( {level:'all' });

    // // capture seneca messages - leaving this here as we *may* do something with it
    // // if the debug level json is not good enough logging.
    // seneca.sub({}, captureAllMessages);
    // function captureAllMessages(args) {
    //   console.log('*** captured = ', JSON.stringify(args));
    // }

    // Use seneca-web middleware with Hapi.

    server.register({
      register: require('hapi-seneca'),
      options: {
        cors: true,
        session: {
          secret: options.session.secret,
          name: 'CD.ZENPLATFORM',
          saveUninitialized: true,
          resave: true
        }
      }
    }, function (err) {
      checkHapiPluginError('hapi-seneca')(err);

      server.start(function() {
        console.log('[%s] Listening on http://localhost:%d', env, port);
      });
    });
  });
});

};
