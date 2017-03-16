import { JWProxy } from 'appium-base-driver';
import log from './logger';
import { SubProcess } from 'teen_process';
import { fs, logger, process } from 'appium-support';
import path from 'path';

const DEFAULT_A4M_HOST = '127.0.0.1';
const DEFAULT_A4M_PORT = 4622;

const REQ_A4M_APP_PATH = path.resolve('/Applications', 'AppiumForMac.app');

const a4mLog = logger.getLogger('Appium4Mac');

class AppiumForMac {
  constructor () {
    this.proxyHost = DEFAULT_A4M_HOST;
    this.proxyPort = DEFAULT_A4M_PORT;
    this.proc = null;
    this.jwproxy = new JWProxy({server: this.proxyHost, port: this.proxyPort});
  }

  async start () {
    if (!await fs.exists(REQ_A4M_APP_PATH)) {
      throw new Error("Could not verify AppiumForMacDriver install; please install to your /Applications folder");
    }

    const startDetector = (stdout, stderr) => {
      return stderr.indexOf("Started HTTP server") !== -1;
    };

    let processIsAlive = false;
    try {
      await this.killAll();

      // set up our subprocess object
      const a4mBinary = path.resolve(REQ_A4M_APP_PATH, "Contents", "MacOS", "AppiumForMac");
      this.proc = new SubProcess(a4mBinary, []);
      processIsAlive = true;

      // handle log output
      for (let stream of ['STDOUT', 'STDERR']) {
        this.proc.on(`lines-${stream.toLowerCase()}`, (lines) => {
          for (let l of lines) {
            a4mLog.info(`[${stream}] ${l.trim()}`);
          }
        });
      }

      // handle out-of-bound exit by simply logging
      // TODO add ability for driver to handle this gracefully and maybe
      // restart
      this.proc.on('exit', (code, signal) => {
        processIsAlive = false;
        let msg = `AppiumForMac exited unexpectedly with code ${code}, ` +
                  `signal ${signal}`;
        log.error(msg);
      });
      log.info(`Spawning AppiumForMac with: ${this.appium4macdriver}`);

      // start subproc and wait for startDetector
      await this.proc.start(startDetector);

      await this.waitForOnline();
    } catch (e) {
      this.emit(AppiumForMac.EVENT_ERROR, e);
      // just because we had an error doesn't mean the winappdriver process
      // finished; we should clean up if necessary
      if (processIsAlive) {
        await this.proc.stop();
      }
      log.errorAndThrow(e);
    }
  }

  sessionId () {
    if (this.state !== AppiumForMac.STATE_ONLINE) {
      return null;
    }

    return this.jwproxy.sessionId;
  }

  async waitForOnline () {
    // TODO: Actually check via HTTP
    return true;
  }

  async getStatus () {
    return await this.sendCommand('/status', 'GET');
  }

  async startSession (caps) {
    this.proxyReqRes = this.jwproxy.proxyReqRes.bind(this.jwproxy);
    await this.sendCommand('/session', 'POST', {desiredCapabilities: caps});
  }

  async stop () {
    try {
      if (this.proc) {
        await this.proc.stop();
      }
    } catch (e) {
      log.error(e);
    }
  }

  async sendCommand (url, method, body) {
    let res;
    // need to cover over A4M's bad handling of responses, which sometimes
    // don't have 'value' properties
    try {
      res = await this.jwproxy.command(url, method, body);
    } catch (e) {
      if (e.message.indexOf("Did not get a valid response object") === -1 ||
          e.message.indexOf("value") !== -1) {
        throw e;
      }
    }
    return res;
  }

  async proxyReq (req, res) {
    return await this.jwproxy.proxyReqRes(req, res);
  }

  async killAll () {
    const processName = "AppiumForMac";
    // js hint cannot handle backticks, even escaped, within template literals
    log.info(`Killing any old AppiumForMac`);
    await process.killProcess(processName);
    log.info("Successfully cleaned up old Appium4Mac servers");
  }

  async deleteSession () {
    log.debug('Deleting AppiumForMac server session');
    // rely on jwproxy's intelligence to know what we're talking about and
    // delete the current session
    try {
      await this.sendCommand('/', 'DELETE');
    } catch (err) {
      log.warn(`Did not get confirmation AppiumForMac deleteSession worked; ` +
        `Error was: ${err}`);
    }
  }
}

export { AppiumForMac, DEFAULT_A4M_HOST, DEFAULT_A4M_PORT};
export default AppiumForMac;
