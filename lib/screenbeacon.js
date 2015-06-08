'use strict';

Screenbeacon.DEFAULT_HOST = 'api.screenbeacon.com';
Screenbeacon.DEFAULT_PORT = '443';
Screenbeacon.DEFAULT_BASE_PATH = '/';
Screenbeacon.DEFAULT_API_VERSION = null;

// Use node's default timeout:
Screenbeacon.DEFAULT_TIMEOUT = require('http').createServer().timeout;

Screenbeacon.PACKAGE_VERSION = require('../package.json').version;

Screenbeacon.USER_AGENT = {
  bindings_version: Screenbeacon.PACKAGE_VERSION,
  lang: 'node',
  lang_version: process.version,
  platform: process.platform,
  publisher: 'screenbeacon',
  uname: null
};

Screenbeacon.USER_AGENT_SERIALIZED = null;

var exec = require('child_process').exec;

var resources = {
  Projects: require('./resources/Projects'),
  Tests: require('./resources/Tests'),
  Alerts: require('./resources/Alerts')
};

Screenbeacon.ScreenbeaconResource = require('./ScreenbeaconResource');
Screenbeacon.resources = resources;

function Screenbeacon(id, token, version) {

  if (!(this instanceof Screenbeacon)) {
    return new Screenbeacon(id, token, version);
  }

  this._api = {
    auth: null,
    host: Screenbeacon.DEFAULT_HOST,
    port: Screenbeacon.DEFAULT_PORT,
    basePath: Screenbeacon.DEFAULT_BASE_PATH,
    version: Screenbeacon.DEFAULT_API_VERSION,
    timeout: Screenbeacon.DEFAULT_TIMEOUT,
    api_id: null,
    api_token: null,
    agent: null,
    dev: false
  };

  this._prepResources();
  this.setApiId(id);
  this.setApiToken(token);
  this.setApiVersion(version);
}

Screenbeacon.prototype = {

  setHost: function(host, port, protocol) {
    this._setApiField('host', host);
    if (port) this.setPort(port);
    if (protocol) this.setProtocol(protocol);
  },

  setProtocol: function(protocol) {
    this._setApiField('protocol', protocol.toLowerCase());
  },

  setPort: function(port) {
    this._setApiField('port', port);
  },

  setApiVersion: function(version) {
    if (version) {
      this._setApiField('version', version);
    }
  },

  setApiId: function(id) {
    if (id) {
      this._setApiField(
        'id', id
      );
    }
  },

  setApiToken: function(token) {
    if (token) {
      this._setApiField(
        'token', token
      );
    }
  },

  setTimeout: function(timeout) {
    this._setApiField(
      'timeout',
      timeout == null ? Screenbeacon.DEFAULT_TIMEOUT : timeout
    );
  },

  setHttpAgent: function(agent) {
    this._setApiField('agent', agent);
  },

  _setApiField: function(key, value) {
    this._api[key] = value;
  },

  getApiField: function(key) {
    return this._api[key];
  },

  getConstant: function(c) {
    return Screenbeacon[c];
  },

  getClientUserAgent: function(cb) {
    if (Screenbeacon.USER_AGENT_SERIALIZED) {
      return cb(Screenbeacon.USER_AGENT_SERIALIZED);
    }
    exec('uname -a', function(err, uname) {
      Screenbeacon.USER_AGENT.uname = uname || 'UNKNOWN';
      Screenbeacon.USER_AGENT_SERIALIZED = JSON.stringify(Screenbeacon.USER_AGENT);
      cb(Screenbeacon.USER_AGENT_SERIALIZED);
    });
  },

  _prepResources: function() {

    for (var name in resources) {
      this[
        name[0].toLowerCase() + name.substring(1)
      ] = new resources[name](this);
    }

  }

};

module.exports = Screenbeacon;
