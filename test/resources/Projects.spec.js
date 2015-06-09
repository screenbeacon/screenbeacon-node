'use strict';
var TEST_API_ID = 'c171aadd4f';
var TEST_API_TOKEN = '82fb985e-4461-4602-909b-d9c0e208977d';
var screenbeacon = require('../testUtils').getSpyableScreenbeacon(TEST_API_ID, TEST_API_TOKEN);
var expect = require('chai').expect;
var Promise = require('bluebird');

describe('Project Resource', function() {

  describe('retrieve', function() {

    it('Sends the correct request', function() {
      screenbeacon.projects.retrieve(238);
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/projects/238',
        headers: {},
        data: {}
      });

    });

  });

  describe('create', function() {

    it('Sends the correct request', function() {

      screenbeacon.projects.create({ name: 'dude', description: 'Some project' });
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/projects',
        headers: {},
        data: { name: 'dude', description: 'Some project' }
      });

    });


    it('Sends the correct request [with specified auth in options]', function() {

      screenbeacon.projects.create({ api_id: TEST_API_ID, api_token: TEST_API_TOKEN, description: 'Some project' });
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/projects',
        headers: {
          "X-API-ID": "c171aadd4f",
          "X-API-TOKEN": "82fb985e-4461-4602-909b-d9c0e208977d"
        },
        data: { description: 'Some project' },
        auth: null
      });

    });

    it('Sends the correct request [with specified auth and idempotent key in options]', function() {

      screenbeacon.customers.create({ description: 'Some customer' }, { idempotency_key: 'foo'});
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/v1/customers',
        headers: {'Idempotency-Key': 'foo'},
        data: { description: 'Some customer' },
        auth: null
      });

    });


    it('Sends the correct request [with specified auth in options and no body]', function() {

      screenbeacon.customers.create();
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/v1/customers',
        headers: {},
        data: {},
        auth: null
      });

    });


  });

  describe('update', function() {

    it('Sends the correct request', function() {

      screenbeacon.customers.update('cus_2dkAb792h1mfa4', {
        description: 'Foo "baz"'
      });
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/v1/customers/cus_2dkAb792h1mfa4',
        headers: {},
        data: { description: 'Foo "baz"' }
      });

    });

  });

  describe('del', function() {

    it('Sends the correct request', function() {

      screenbeacon.customers.del('cus_2dkAb792h1mfa4');
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'DELETE',
        url: '/v1/customers/cus_2dkAb792h1mfa4',
        headers: {},
        data: {}
      });

    });

  });

  describe('list', function() {

    it('Sends the correct request', function() {

      screenbeacon.customers.list();
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/v1/customers',
        headers: {},
        data: {}
      });

    });

    it('Sends the correct request [with specified auth]', function() {

      screenbeacon.customers.list();
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/v1/customers',
        headers: {},
        data: {},
        auth: null
      });

    });

  });

});
