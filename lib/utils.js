import _ from 'lodash';
import { exec } from 'teen_process';
import { fs } from 'appium-support';
import log from './logger';


async function findAppPath (bundleId) {
  try {
    const {stdout} = await exec('/usr/bin/mdfind', [
      `kMDItemCFBundleIdentifier=${bundleId}`
    ]);
    const appPath = _.trim(stdout);
    if (await fs.exists(appPath)) {
      return appPath;
    }
  } catch (e) {
    log.info(e.stderr);
  }
  return null;
}

export { findAppPath };
