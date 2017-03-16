#!/usr/bin/env node
// transpile:main

import yargs from 'yargs';
import { asyncify } from 'asyncbox';
import { startServer } from './lib/server';
import { MacDriver } from './lib/driver';

const DEFAULT_HOST = "localhost";
const DEFAULT_PORT = 4723;

async function main () {
  let port = yargs.argv.port || DEFAULT_PORT;
  let address = yargs.argv.address || DEFAULT_HOST;
  return await startServer(port, address);
}

if (require.main === module) {
  asyncify(main);
}

export { MacDriver };

export default MacDriver;

