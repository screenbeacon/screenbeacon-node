'use strict';

var ScreenbeaconResource = require('../ScreenbeaconResource');
var utils = require('../utils');
var screenbeaconMethod = ScreenbeaconResource.method;

module.exports = ScreenbeaconResource.extend({

  path: 'projects',
  includeBasic: [
    'create', 'list', 'retrieve', 'update', 'del'
  ],

  listAlerts: screenbeaconMethod({
    method: 'GET',
    path: '{projectId}/alerts',
    urlParams: ['projectId']
  }),

  resolveAll: screenbeaconMethod({
    method: 'PATCH',
    path: '{projectId}/resolve_all',
    urlParams: ['projectId']
  }),

  run: screenbeaconMethod({
    method: 'POST',
    path: '{projectId}/run',
    urlParams: ['projectId']
  })

});
