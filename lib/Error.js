'use strict';

var utils = require('./utils');

module.exports = _Error;

/**
 * Generic Error klass to wrap any errors returned by screenbeacon-node
 */
function _Error(raw) {
  this.populate.apply(this, arguments);
  this.stack = (new Error(this.message)).stack;
}

// Extend Native Error
_Error.prototype = Object.create(Error.prototype);

_Error.prototype.type = 'GenericError';
_Error.prototype.populate = function(type, message) {
  this.type = type;
  this.message = message;
};

_Error.extend = utils.protoExtend;

/**
 * Create subclass of internal Error klass
 * (Specifically for errors returned from Screenbeacon's REST API)
 */
var ScreenbeaconError = _Error.ScreenbeaconError = _Error.extend({
  type: 'ScreenbeaconError',
  populate: function(raw) {

    // Move from prototype def (so it appears in stringified obj)
    this.type = this.type;

    this.stack = (new Error(raw.message)).stack;
    this.rawType = raw.type;
    this.code = raw.code;
    this.param = raw.param;
    this.message = raw.message;
    this.detail = raw.detail;
    this.raw = raw;

  }
});

/**
 * Helper factory which takes raw screenbeacon errors and outputs wrapping instances
 */
ScreenbeaconError.generate = function(rawScreenbeaconError) {
  switch (rawScreenbeaconError.type) {
    case 'card_error':
      return new _Error.ScreenbeaconCardError(rawScreenbeaconError);
    case 'invalid_request_error':
      return new _Error.ScreenbeaconInvalidRequestError(rawScreenbeaconError);
    case 'api_error':
      return new _Error.ScreenbeaconAPIError(rawScreenbeaconError);
  }
  return new _Error('Generic', 'Unknown Error');
};

// Specific Screenbeacon Error types:
_Error.ScreenbeaconInvalidRequestError = ScreenbeaconError.extend({ type: 'ScreenbeaconInvalidRequest' });
_Error.ScreenbeaconAPIError = ScreenbeaconError.extend({ type: 'ScreenbeaconAPIError' });
_Error.ScreenbeaconAuthenticationError = ScreenbeaconError.extend({ type: 'ScreenbeaconAuthenticationError' });
_Error.ScreenbeaconConnectionError = ScreenbeaconError.extend({ type: 'ScreenbeaconConnectionError' });
