'use strict';

var http = require('http');
var https = require('https');
var path = require('path');
var Promise = require('bluebird');
var _ = require('lodash');

var utils = require('./utils');
var Error = require('./Error');

var hasOwn = {}.hasOwnProperty;


// Provide extension mechanism for Screenbeacon Resource Sub-Classes
ScreenbeaconResource.extend = utils.protoExtend;

// Expose method-creator & prepared (basic) methods
ScreenbeaconResource.method = require('./ScreenbeaconMethod');
ScreenbeaconResource.BASIC_METHODS = require('./ScreenbeaconMethod.basic');

/**
 * Encapsulates request logic for a Screenbeacon Resource
 */
function ScreenbeaconResource(screenbeacon, urlData) {

  this._screenbeacon = screenbeacon;
  this._urlData = urlData || {};

  this.basePath = utils.makeURLInterpolator(screenbeacon.getApiField('basePath'));
  this.path = utils.makeURLInterpolator(this.path);

  if (this.includeBasic) {
    this.includeBasic.forEach(function(methodName) {
      this[methodName] = ScreenbeaconResource.BASIC_METHODS[methodName];
    }, this);
  }

  this.initialize.apply(this, arguments);

}

ScreenbeaconResource.prototype = {

  path: '',

  initialize: function() {},

  // Function to override the default data processor. This allows full control
  // over how a ScreenbeaconResource's request data will get converted into an HTTP
  // body. This is useful for non-standard HTTP requests. The function should
  // take method name, data, and headers as arguments.
  requestDataProcessor: null,

  // String that overrides the base API endpoint. If `overrideHost` is not null
  // then all requests for a particular resource will be sent to a base API
  // endpoint as defined by `overrideHost`.
  overrideHost: null,

  createFullPath: function(commandPath, urlData) {
    return path.join(
      this.basePath(urlData),
      this.path(urlData),
      typeof commandPath == 'function' ?
        commandPath(urlData) : commandPath
    ).replace(/\\/g, '/'); // ugly workaround for Windows
  },

  createUrlData: function() {
    var urlData = {};
    // Merge in baseData
    for (var i in this._urlData) {
      if (hasOwn.call(this._urlData, i)) {
        urlData[i] = this._urlData[i];
      }
    }
    return urlData;
  },

  createDeferred: function(callback) {
      var deferred = Promise.defer();

      if (callback) {
        // Callback, if provided, is a simply translated to Promise'esque:
        // (Ensure callback is called outside of promise stack)
        deferred.promise.then(function(res) {
          setTimeout(function(){ callback(null, res) }, 0);
        }, function(err) {
          setTimeout(function(){ callback(err, null); }, 0);
        });
      }

      return deferred;
  },

  _timeoutHandler: function(timeout, req, callback) {
    var self = this;
    return function() {
      var timeoutErr = new Error('ETIMEDOUT');
      timeoutErr.code = 'ETIMEDOUT';

      req._isAborted = true;
      req.abort();

      callback.call(
        self,
        new Error.ScreenbeaconConnectionError({
          message: 'Request aborted due to timeout being reached (' + timeout + 'ms)',
          detail: timeoutErr
        }),
        null
      );
    }
  },

  _responseHandler: function(req, callback) {
    var self = this;
    return function(res) {
      var response = '';

      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        response += chunk;
      });
      res.on('end', function() {
        try {
          response = JSON.parse(response);
          if (response.error) {
            var err;
            if (res.statusCode === 401) {
              err = new Error.ScreenbeaconAuthenticationError(response.error);
            } else {
              err = Error.ScreenbeaconError.generate(response.error);
            }
            return callback.call(self, err, null);
          }
        } catch (e) {
          return callback.call(
            self,
            new Error.ScreenbeaconAPIError({
              message: 'Invalid JSON received from the Screenbeacon API',
              response: response,
              exception: e
            }),
            null
          );
        }
        callback.call(self, null, response);
      });
    };
  },

  _errorHandler: function(req, callback) {
    var self = this;
    return function(error) {
      if (req._isAborted) return; // already handled
      callback.call(
        self,
        new Error.ScreenbeaconConnectionError({
          message: 'An error occurred with our connection to Screenbeacon',
          detail: error
        }),
        null
      );
    }
  },

  _request: function(method, path, data, auth, options, callback) {
    var requestData = utils.stringifyRequestData(data || {});
    var self = this;
    var requestData;

    if (self.requestDataProcessor) {
      requestData = self.requestDataProcessor(method, data, options.headers);
    } else {
      requestData = utils.stringifyRequestData(data || {});
    }

    var apiVersion = this._screenbeacon.getApiField('version');

    console.log('_request:', method, path, data, auth, options, callback);
    console.log('id:', this._screenbeacon.getApiField('id'));
    console.log('token:', this._screenbeacon.getApiField('token'));

    var headers = {
      // Use specified auth token or use default from this screenbeacon instance:
      'X-API-ID': this._screenbeacon.getApiField('id'),
      'X-API-TOKEN': this._screenbeacon.getApiField('token'),
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': requestData.length,
      'User-Agent': 'Screenbeacon/v1 NodeBindings/' + this._screenbeacon.getConstant('PACKAGE_VERSION')
    };

    if (apiVersion) {
      headers['Screenbeacon-Version'] = apiVersion;
    }

    // Grab client-user-agent before making the request:
    this._screenbeacon.getClientUserAgent(function(cua) {
      headers['X-Screenbeacon-Client-User-Agent'] = cua;

      if (options.headers) {
        headers = _.extend(headers, options.headers);
      }

      makeRequest();
    });


    function makeRequest() {

      var timeout = self._screenbeacon.getApiField('timeout');
      var isInsecureConnection = self._screenbeacon.getApiField('protocol') == 'http';

      var host = self.overrideHost || self._screenbeacon.getApiField('host');

      var req = (
        isInsecureConnection ? http : https
      ).request({
        host: host,
        port: self._screenbeacon.getApiField('port'),
        path: path,
        method: method,
        agent: self._screenbeacon.getApiField('agent'),
        headers: headers,
        ciphers: "DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5"
      });

      req.setTimeout(timeout, self._timeoutHandler(timeout, req, callback));
      req.on('response', self._responseHandler(req, callback));
      req.on('error', self._errorHandler(req, callback));

      req.on('socket', function(socket) {
        socket.on((isInsecureConnection ? 'connect' : 'secureConnect'), function() {
          // Send payload; we're safe:
          req.write(requestData);
          req.end();
        });
      });

    }

  }

};

module.exports = ScreenbeaconResource;
