import { BaseDriver } from 'appium-base-driver';
import { system } from 'appium-support';
import {
  AppiumForMac, DEFAULT_A4M_HOST, A4M_APP_BUNDLE_ID,
  DEFAULT_A4M_PORT, REQ_A4M_APP_PATH,
} from './appium-for-mac';
import desiredCapConstraints from './desired-caps';
import logger from './logger';
import commands from './commands/index';
import _ from 'lodash';
import { findAppPath } from './utils';


const NO_PROXY_LIST = [
  ['GET', new RegExp('^/session/[^/]+/log/types')],
  ['POST', new RegExp('^/session/[^/]+/execute')],
  ['POST', new RegExp('^/session/[^/]+/log')],
];

// Appium instantiates this class
class MacDriver extends BaseDriver {
  constructor (opts = {}, shouldValidateCaps = true) {
    super(opts, shouldValidateCaps);
    this.jwpProxyActive = false;
    this.opts.address = opts.address || DEFAULT_A4M_HOST;

    this.desiredCapConstraints = desiredCapConstraints;

    for (const [cmd, fn] of _.toPairs(commands)) {
      MacDriver.prototype[cmd] = fn;
    }
  }

  async createSession (...args) {
    if (!system.isMac()) {
      throw new Error('AppiumForMac tests only run on the Mac');
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
    let a4mAppPath = this.opts.a4mAppPath;
    if (!a4mAppPath) {
      logger.debug(`The path to AppiumForMac server has not been provided explicitly. ` +
        `Trying to autodetect it`);
      a4mAppPath = await findAppPath(A4M_APP_BUNDLE_ID);
      if (a4mAppPath) {
        logger.info(`Autodetected AppiumForMac server's location at '${a4mAppPath}'`);
      } else {
        a4mAppPath = REQ_A4M_APP_PATH;
        logger.info(`Cannot autodetect AppiumForMac server's location. ` +
          `Using the default server path at '${a4mAppPath}'. Consider ` +
          `providing a custom path to 'a4mAppPath' capability if such behaviour ` +
          `is undesired`);
      }
    }
    this.opts.a4mAppPath = a4mAppPath;
    _.defaults(this.opts, {
      a4mHost: DEFAULT_A4M_HOST,
      a4mPort: DEFAULT_A4M_PORT,
    });
    this.a4mDriver = new AppiumForMac(this.opts);

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

  getProxyAvoidList () {
    return NO_PROXY_LIST;
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
