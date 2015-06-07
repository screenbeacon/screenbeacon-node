'use strict';

require('./testUtils');

var Error = require('../lib/Error');
var expect = require('chai').expect;

describe('Error', function() {

  it('Populates with type and message params', function() {
    var e = new Error('FooError', 'Foo happened');
    expect(e).to.have.property('type', 'FooError');
    expect(e).to.have.property('message', 'Foo happened');
    expect(e).to.have.property('stack');
  });

  describe('ScreenbeaconError', function() {
    it('Generates specific instance depending on error-type', function() {
      expect(Error.ScreenbeaconError.generate({ type: 'invalid_request_error' })).to.be.instanceOf(Error.ScreenbeaconInvalidRequestError);
      expect(Error.ScreenbeaconError.generate({ type: 'api_error' })).to.be.instanceOf(Error.ScreenbeaconAPIError);
    });
  });

});
