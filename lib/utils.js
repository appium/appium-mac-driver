import _ from 'lodash';
import { exec } from 'teen_process';
import { fs } from 'appium-support';
import log from './logger';


async function findAppPath (bundleId) {
  let stdout;
  try {
    const output = await exec('/usr/bin/mdfind', [
      `kMDItemCFBundleIdentifier=${bundleId}`
    ]);
    stdout = output.stdout;
  } catch (e) {
    log.info(e.stderr || e.message);
    return null;
  }

  const matchedPaths = _.trim(stdout)
    .split('\n')
    .map((p) => _.trim(p))
    .filter(Boolean);
  const appsMapping = {};
  for (const matchedPath of matchedPaths) {
    if (await fs.exists(matchedPath)) {
      const {mtimeMs} = await fs.stat(matchedPath);
      appsMapping[matchedPath] = mtimeMs;
    }
  }
  if (_.isEmpty(appsMapping)) {
    return null;
  }
  if (_.size(appsMapping) > 1) {
    log.debug(`Got multiple apps having the bundle identifier '${bundleId}': ` +
      `${_.keys(appsMapping)}. Will return the most recent one`);
  }
  // Get the most recent app
  return _.toPairs(appsMapping)
    .reduce((acc, x) => (x[1] > acc[1] ? x : acc))[0];
}

export { findAppPath };
