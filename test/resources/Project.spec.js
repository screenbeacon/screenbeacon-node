'use strict';

var screenbeacon = require('../testUtils').getSpyableScreenbeacon();
var expect = require('chai').expect;
var Promise = require('bluebird');

var TEST_AUTH_KEY = 'aGN0bIwXnHdw5645VABjPdSn8nWY7G11';

describe('Project Resource', function() {

  describe('retrieve', function() {

    it('Sends the correct request', function() {

      screenbeacon.project.retrieve(238);
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/v1/customers/cus_2dkAb792h1mfa4',
        headers: {},
        data: {}
      });

    });

    it('Sends the correct request [with specified auth]', function() {

      screenbeacon.project.retrieve('dalkf', TEST_AUTH_KEY);
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/v1/customers/cus_2dkAb792h1mfa4',
        headers: {},
        data: {},
        auth: TEST_AUTH_KEY
      });

    });

  });

  describe('create', function() {

    it('Sends the correct request', function() {

      screenbeacon.customers.create({ description: 'Some customer' });
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/v1/customers',
        headers: {},
        data: { description: 'Some customer' }
      });

    });

    it('Sends the correct request [with specified auth]', function() {

      screenbeacon.customers.create({ description: 'Some customer' }, TEST_AUTH_KEY);
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/v1/customers',
        headers: {},
        data: { description: 'Some customer' },
        auth: TEST_AUTH_KEY
      });

    });

    it('Sends the correct request [with specified auth and no body]', function() {

      screenbeacon.customers.create(TEST_AUTH_KEY);
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/v1/customers',
        headers: {},
        data: {},
        auth: TEST_AUTH_KEY
      });

    });

    it('Sends the correct request [with specified idempotency_key in options]', function() {

      screenbeacon.customers.create({ description: 'Some customer' }, { idempotency_key: 'foo' });
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/v1/customers',
        headers: {'Idempotency-Key': 'foo'},
        data: { description: 'Some customer' },
      });

    });

    it('Sends the correct request [with specified auth in options]', function() {

      screenbeacon.customers.create({ description: 'Some customer' }, { api_key: TEST_AUTH_KEY });
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/v1/customers',
        headers: {},
        data: { description: 'Some customer' },
        auth: TEST_AUTH_KEY
      });

    });

    it('Sends the correct request [with specified auth and idempotent key in options]', function() {

      screenbeacon.customers.create({ description: 'Some customer' }, { api_key: TEST_AUTH_KEY, idempotency_key: 'foo'});
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/v1/customers',
        headers: {'Idempotency-Key': 'foo'},
        data: { description: 'Some customer' },
        auth: TEST_AUTH_KEY
      });

    });


    it('Sends the correct request [with specified auth in options and no body]', function() {

      screenbeacon.customers.create({ api_key: TEST_AUTH_KEY });
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/v1/customers',
        headers: {},
        data: {},
        auth: TEST_AUTH_KEY
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

      screenbeacon.customers.list(TEST_AUTH_KEY);
      expect(screenbeacon.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/v1/customers',
        headers: {},
        data: {},
        auth: TEST_AUTH_KEY
      });

    });

  });

});
