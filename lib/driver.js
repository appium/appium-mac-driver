import { BaseDriver } from 'appium-base-driver';
import { system } from 'appium-support';
import { AppiumForMacDriverServer, DEFAULT_A4M_HOST} from './appium4macdriver';
import logger from './logger';

// Appium instantiates this class
class MacDriver extends BaseDriver {
  constructor (opts = {}, shouldValidateCaps = true) {
    super(opts, shouldValidateCaps);
    this.jwpProxyActive = false;
    this.opts.address = opts.address || DEFAULT_A4M_HOST;
  }

  async createSession (caps) {
    if (!system.isMac()) {
      throw new Error("AppiumForMacDriverServer tests only run on the Mac");
    }
    try {
      let sessionId;
      [sessionId] = await super.createSession(caps);
      await this.startAppium4MacDriverSession();
      return [sessionId, caps];
    } catch (e) {
      await this.deleteSession();
      throw e;
    }
  }

  async startAppium4MacDriverSession () {
    this.a4mDriver = new AppiumForMacDriverServer();

    await this.a4mDriver.start();
    await this.a4mDriver.startSession(this.caps);
    this.proxyReqRes = this.a4mDriver.proxyReqRes.bind(this.a4mDriver);
    // now that everything has started successfully, turn on proxying so all
    // subsequent session requests go straight to/from AppiumForMacDriverServer
    this.jwpProxyActive = true;
  }

  async deleteSession () {
    logger.debug('Deleting AppiumForMacDriverServer session');

    if (this.a4mDriver && this.jwpProxyActive) {
      await this.a4mDriver.deleteSession();
      await this.a4mDriver.stop();
      this.a4mDriver = null;
    }
    this.jwpProxyActive = false;
    await super.deleteSession();
  }

  proxyActive () {
    // we always have an active proxy to the AppiumForMacDriverServer server
    return true;
  }

  canProxy () {
    // we can always proxy to the AppiumForMacDriverServer server
    return true;
  }

  get driverData () {
    return {A4MPort: this.opts.port};
  }
}

export { MacDriver };
export default MacDriver;
