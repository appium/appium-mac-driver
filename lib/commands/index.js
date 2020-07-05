import executeCmds from './execute';
import loggingCommands from './logging';

const commands = {};
Object.assign(
  commands,
  executeCmds,
  loggingCommands
  // add other command types here
);

export { commands };
export default commands;
