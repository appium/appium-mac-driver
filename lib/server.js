import log from './logger';
import { server as baseServer, routeConfiguringFunction  } from 'appium-base-driver';
import { MacDriver } from './driver';

function startServer (port, address) {
  let driver = new MacDriver({port, address});
  let router = routeConfiguringFunction(driver);
  let server = baseServer(router, port, address);
  log.info(`MacDriver server listening on http://${address}:${port}`);
  return server;
}

export { startServer };
