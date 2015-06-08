'use strict';

var ScreenbeaconResource = require('../ScreenbeaconResource');
var utils = require('../utils');
var screenbeaconMethod = ScreenbeaconResource.method;

module.exports = ScreenbeaconResource.extend({

  path: 'alerts',
  includeBasic: [
    'create', 'list', 'retrieve', 'update', 'del'
  ],

  resolve: screenbeaconMethod({
    method: 'PATCH',
    path: '{alertId}/resolve',
    urlParams: ['alertId']
  }),

  resolveAll: screenbeaconMethod({
    method: 'POST',
    path: '/resolve_all',
    urlParams: []
  })

});
