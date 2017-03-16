// transpile:mocha

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import AppiumForMac from '../../lib/appium-for-mac';
import { withMocks } from 'appium-test-support';

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

describe('AppiumForMac', () => {
  describe('#startSession', withMocks({ }, (mocks, S) => {
    let appium4MacDriver = new AppiumForMac(buildAppiumForMacOpts());

    it('should start a session', async () => {
      let caps = {foo: 'bar'};
      mocks.jwproxy = S.sandbox.mock(appium4MacDriver.jwproxy);
      mocks.jwproxy.expects("command").once()
        .withExactArgs("/session", "POST", {desiredCapabilities: caps})
        .returns(Promise.resolve());
      await appium4MacDriver.startSession(caps);
      mocks.jwproxy.verify();
    });
  }));
});

