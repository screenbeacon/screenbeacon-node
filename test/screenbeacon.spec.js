'use strict';

var testUtils = require('./testUtils');
var Promise = require('bluebird');
var screenbeacon = require('../lib/screenbeacon')(
  testUtils.getAccountScreenbeaconId(),
  'latest'
);

var expect = require('chai').expect;

// var CUSTOMER_DETAILS = {
//   description: 'Some customer',
//   card: {
//     number: '4242424242424242',
//     exp_month: 12,
//     exp_year: 2015
//   }
// };

describe('Screenbeacon Module', function() {

  var cleanup = new testUtils.CleanupUtility();
  this.timeout(20000);

  describe('ClientUserAgent', function() {
    it('Should return a user-agent serialized JSON object', function() {
      var d = Promise.defer();
      screenbeacon.getClientUserAgent(function(c) {
        d.resolve(JSON.parse(c));
      });
      return expect(d.promise).to.eventually.have.property('lang', 'node');
    });
  });

  describe('setTimeout', function() {
    it('Should define a default equal to the node default', function() {
      expect(screenbeacon.getApiField('timeout')).to.equal(require('http').createServer().timeout);
    });
    it('Should allow me to set a custom timeout', function() {
      screenbeacon.setTimeout(900);
      expect(screenbeacon.getApiField('timeout')).to.equal(900);
    });
    it('Should allow me to set null, to reset to the default', function() {
      screenbeacon.setTimeout(null);
      expect(screenbeacon.getApiField('timeout')).to.equal(require('http').createServer().timeout);
    });
  });

  describe('Callback support', function() {

    describe('Any given endpoint', function() {

      it('Will call a callback if successful', function() {

        var defer = Promise.defer();
        screenbeacon.projects.create({
          name: 'Some project',
          beaconscript: "width 1280\nvisit 'https://www.screenbeacon.com'"
        }, function(err, project) {
          cleanup.deleteProject(project.id);
          defer.resolve('Called!');
        });

        return expect(defer.promise).to.eventually.equal('Called!');
      });

    });
  });

});
