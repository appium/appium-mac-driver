import executeCmds from './execute';

const commands = {};
Object.assign(
  commands,
  executeCmds,
  // add other command types here
);

export { commands };
export default commands;
