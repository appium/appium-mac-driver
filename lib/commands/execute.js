import { exec } from 'teen_process';
import _ from 'lodash';
import log from '../logger';
import { fs, tempDir } from 'appium-support';
import path from 'path';

const SYSTEM_SHELL_FEATURE = 'system_shell';

const commands = {};

/**
 * @typedef {Object} ExecOptions
 * @property {?string} interpreter - Full path to the command line interpreter binary.
 * The current interpreter (`$SHELL`) or `/bin/bash` is used by default
 * @property {?boolean} throwOnFail [false] - Whether to throw an exception if
 * the given script has returned non-zero exit code
 * @property {?number} timeout [20000] - The default timeout for the script execution.
 * @property {?Object} env [process.env] - Additional environment variables for
 * the shell script
 */

/**
 * @typedef {Object} ExecResult
 * @property {string} stdout - Script stdout
 * @property {string} stderr - Script stderr
 * @property {number} code - Script return code. It will never be other
 * than zero if `throwOnFail` option is set to `true`
 */

/**
 * Executes the given shell script if the `system_shell`
 * server feature is enabled. The command blocks until
 * the script finishes its execution or its timeout expires.
 *
 * @param {!string} script - The actual shell script to execute.
 * This should be a valid script snippet.
 * @param {?ExecOptions} args
 * @return {ExecResult} - The result of the script execution
 * @throws {Error} If there was a problem during command execution
 */
commands.execute = async function execute (script, args) {
  this.ensureFeatureEnabled(SYSTEM_SHELL_FEATURE);

  if (_.isEmpty(script)) {
    log.errorAndThrow(`The 'script' argument cannot be empty`);
  }

  let opts = {};
  if (_.isArray(args) && _.isPlainObject(args[0])) {
    opts = args[0];
  } else if (_.isPlainObject(args)) {
    opts = args;
  }
  const {
    interpreter = process.env.SHELL || '/bin/bash',
    throwOnFail = false,
    timeout,
    env,
  } = opts;

  const tmpRoot = await tempDir.openDir();
  try {
    const tmpScriptPath = path.resolve(tmpRoot, 'appium.sh');
    await fs.writeFile(tmpScriptPath, script, 'utf8');
    log.debug(`Executing script using '${interpreter}' shell interpreter:`);
    const execOpts = {};
    if (_.isInteger(timeout)) {
      log.debug(`- Timeout: ${timeout}ms`);
      execOpts.timeout = timeout;
    }
    if (!_.isEmpty(env)) {
      log.debug(`- Environment: ${JSON.stringify(env)}`);
      execOpts.env = Object.assign({}, process.env, env);
    }
    log.debug(script);
    // TODO: Add some perf measurement here?
    const {stdout, stderr} = await exec(interpreter, [tmpScriptPath], execOpts);
    return {
      stdout,
      stderr,
      code: 0,
    };
  } catch (e) {
    if (_.has(e, 'code')) {
      const {stdout, stderr, code} = e;
      // Do not throw if the script return code is not zero
      log.debug(`The script has returned non-zero exit code ${code}`);
      if (stderr) {
        log.debug(`Stderr: ${stderr}`);
      }
      if (!throwOnFail) {
        return {stdout, stderr, code};
      }
    }
    throw e;
  } finally {
    await fs.rimraf(tmpRoot);
  }
};

export { commands };
export default commands;
