import log from './logger';
import { server as baseServer, routeConfiguringFunction } from 'appium-base-driver';
import { MacDriver } from './driver';


async function startServer (port, address) {
  const driver = new MacDriver({port, address});
  const server = await baseServer({
    routeConfiguringFunction: routeConfiguringFunction(driver),
    port,
    hostname: address,
  });
  log.info(`MacDriver server listening on http://${address}:${port}`);
  return server;
}

export { startServer };
