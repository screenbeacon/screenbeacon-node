'use strict';

var ScreenbeaconResource = require('../ScreenbeaconResource');
var utils = require('../utils');
var screenbeaconMethod = ScreenbeaconResource.method;

module.exports = ScreenbeaconResource.extend({

  path: 'tests',
  includeBasic: [
    'create', 'list', 'retrieve', 'update', 'del'
  ],

  resolve: screenbeaconMethod({
    method: 'PATCH',
    path: '{testId}/resolve',
    urlParams: ['testId']
  }),

  run: screenbeaconMethod({
    method: 'PATCH',
    path: '{testId}/run',
    urlParams: ['testId']
  }),

  pause: screenbeaconMethod({
    method: 'PATCH',
    path: '{testId}/pause',
    urlParams: ['testId']
  })

});
