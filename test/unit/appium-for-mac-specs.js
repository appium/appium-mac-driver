// transpile:mocha

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import AppiumForMac from '../../lib/appium-for-mac';
import { withSandbox } from 'appium-test-support';
import B from 'bluebird';


chai.should();
chai.use(chaiAsPromised);

function buildAppiumForMacOpts () {
  return {
    app: 'foo',
    platformName: 'Mac',
    host: 'localhost',
    port: 4623
  };
}

describe('AppiumForMac', function () {
  describe('#startSession', withSandbox({}, (S) => {
    let appium4MacDriver = new AppiumForMac(buildAppiumForMacOpts());

    afterEach(function () {
      S.verify();
    });

    it('should start a session', async function () {
      let caps = {foo: 'bar'};
      S.mocks.jwproxy = S.sandbox.mock(appium4MacDriver.jwproxy);
      S.mocks.jwproxy.expects("command").once()
        .withExactArgs("/session", "POST", {desiredCapabilities: caps})
        .returns(B.resolve());
      await appium4MacDriver.startSession(caps);
    });
  }));
});
