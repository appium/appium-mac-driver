// transpile:mocha

import MacDriver from '../..';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

chai.should();
chai.use(chaiAsPromised);

describe('driver.js', () => {
  describe('constructor', () => {
    it('calls BaseDriver constructor with opts', () => {
      let driver = new MacDriver({foo: 'bar'});
      driver.should.exist;
      driver.opts.foo.should.equal('bar');
    });
  });

  describe('createSession', () => {
    it('should set sessionId', async () => {
      let driver = new MacDriver({app: 'myapp'}, false);
      sinon.mock(driver).expects('startAppiumForMacSession')
          .once()
          .returns(Promise.resolve());
      await driver.createSession({cap: 'foo'});
      driver.sessionId.should.exist;
      driver.caps.cap.should.equal('foo');
    });
  });

  describe('proxying', () => {
    let driver;
    before(() => {
      driver = new MacDriver({}, false);
      driver.sessionId = 'abc';
    });
    describe('#proxyActive', () => {
      it('should exist', () => {
        driver.proxyActive.should.be.an.instanceof(Function);
      });
      it('should return true', () => {
        driver.proxyActive('abc').should.be.true;
      });
      it('should throw an error if session id is wrong', () => {
        (() => {driver.proxyActive('aaa');}).should.throw;
      });
    });

    describe('#canProxy', () => {
      it('should exist', () => {
        driver.canProxy.should.be.an.instanceof(Function);
      });
      it('should return true', () => {
        driver.canProxy('abc').should.be.true;
      });
      it('should throw an error if session id is wrong', () => {
        (() => {driver.canProxy('aaa'); }).should.throw;
      });
    });
  });
});
