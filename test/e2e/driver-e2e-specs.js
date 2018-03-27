import wd from 'wd';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { startServer } from '../../lib/server';
chai.should();
chai.use(chaiAsPromised);

const TEST_PORT = 4788;
const TEST_HOST = "localhost";

let server, driver;

describe('Driver', function () {
  before(async function () {
    server = await startServer(TEST_PORT, TEST_HOST);
  });

  after(async function () {
    await server.close();
  });

  beforeEach(async function () {
    driver = wd.promiseChainRemote(TEST_HOST, TEST_PORT);
  });

  afterEach(async function () {
    await driver.quit();
  });

  it('should run a basic session using a real client', async function () {
    await driver.init({
      app: "Calculator",
      platformName: "Mac",
      deviceName: "Mac",
    });
    let button = await driver.elementByXPath("/AXApplication[@AXTitle='Calculator']/AXWindow[0]/AXGroup[1]/AXButton[@AXDescription='nine']");
    await button.click();
  });
});
