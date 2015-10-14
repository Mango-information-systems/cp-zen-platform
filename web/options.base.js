
function forumModerators() {
  var moderators = process.env.FORUM_MODS || '';
  return moderators.split(',');
}

module.exports = {

  actcache: {active:false},
  'main': {
    'timeout': 120000,
    strict: {add:false,  result:false}
  },

  'user-roles': {
    roles: {
      'basic-user': {
        prefixmap: {
          '/dashboard/dojo-list': 1,
          '/dashboard/my-dojos': 1,
          '/dashboard/start-dojo': 1
        }
      },
      'cdf-admin': {
        prefixmap: {
          '/dashboard/dojo-list': 1,
          '/dashboard/my-dojos': 1,
          '/dashboard/start-dojo': 1,
          '/dashboard/manage-dojos': 1,
          '/dashboard/stats': 1
        }
      }
    }
  },

  //All of these routes are restricted.
  //Routes below can be unrestricted by adding them to the relevant user role above
  'web-access': {
    prefixlist: [
      '/dashboard/dojo-list',
      '/dashboard/my-dojos',
      '/dashboard/start-dojo',
      '/dashboard/manage-dojos',
      '/dashboard/stats',
      '/admin'
    ]
  },

  webclient: {
    adultforum: process.env.ADULT_FORUM || 'http://localhost:4567',
    youthforum: process.env.YOUTH_FORUM || 'http://localhost:4567',
    forumModerators: forumModerators()
  }

};
