import { BaseDriver } from 'appium-base-driver';
import { system } from 'appium-support';
import { AppiumForMac, DEFAULT_A4M_HOST} from './appium-for-mac';
import logger from './logger';

// Appium instantiates this class
class MacDriver extends BaseDriver {
  constructor (opts = {}, shouldValidateCaps = true) {
    super(opts, shouldValidateCaps);
    this.jwpProxyActive = false;
    this.opts.address = opts.address || DEFAULT_A4M_HOST;
  }

  async createSession (...args) {
    if (!system.isMac()) {
      throw new Error("AppiumForMac tests only run on the Mac");
    }
    try {
      let [sessionId, caps] = await super.createSession(...args);
      await this.startAppiumForMacSession();
      if (caps.app) {
        logger.info(`Automatically navigating to app '${caps.app}'`);
        await this.a4mDriver.sendCommand('/url', 'POST', {url: caps.app});
      }
      return [sessionId, caps];
    } catch (e) {
      await this.deleteSession();
      throw e;
    }
  }

  async startAppiumForMacSession () {
    this.a4mDriver = new AppiumForMac();

    await this.a4mDriver.start();
    await this.a4mDriver.startSession(this.caps);
    this.proxyReqRes = this.a4mDriver.proxyReqRes.bind(this.a4mDriver);
    // now that everything has started successfully, turn on proxying so all
    // subsequent session requests go straight to/from AppiumForMac
    this.jwpProxyActive = true;
  }

  async deleteSession () {
    logger.debug('Deleting AppiumForMac session');

    if (this.a4mDriver && this.jwpProxyActive) {
      await this.a4mDriver.deleteSession();
      await this.a4mDriver.stop();
      this.a4mDriver = null;
    }
    this.jwpProxyActive = false;
    await super.deleteSession();
  }

  proxyActive () {
    // we always have an active proxy to the AppiumForMac server
    return true;
  }

  canProxy () {
    // we can always proxy to the AppiumForMac server
    return true;
  }

  get driverData () {
    return {A4MPort: this.opts.port};
  }
}

export { MacDriver };
export default MacDriver;
