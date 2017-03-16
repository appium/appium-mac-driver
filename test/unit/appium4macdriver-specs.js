// transpile:mocha

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import AppiumForMacDriverServer from '../../lib/appium4macdriver';
import { withMocks } from 'appium-test-support';

chai.should();
chai.use(chaiAsPromised);

function buildAppium4MacDriverOpts () {
  return {
    app: 'foo',
    platformName: 'Mac',
    host: 'localhost',
    port: 4623
  };
}

describe('Appium4MacDriverServer', () => {
  describe('#startSession', withMocks({ }, (mocks, S) => {
    let appium4MacDriver = new AppiumForMacDriverServer(buildAppium4MacDriverOpts());

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

