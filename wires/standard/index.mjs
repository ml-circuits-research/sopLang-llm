import { inputCommand } from './input.mjs';
import { literalCommand } from './literal.mjs';
import { jsEvalCommand } from './jsEval.mjs';
import { modelCallCommand } from './modelCall.mjs';
import { containerCommands } from './containers.mjs';
import { graphPathCommand } from './graphPath.mjs';
import { aggregateCommand } from './aggregate.mjs';
import { fractionCommand } from './fraction.mjs';

/**
 * The standard wire vocabulary of the reference profile.
 *
 * A small standard library gives the student stable concepts without turning
 * SOP Lang into a large programming language. The vocabulary is biased toward
 * orchestration, deterministic delegation, explicit neural calls, and typed
 * state; ordinary domain operations belong in JavaScript or in installable
 * `.mjs` wire types.
 */

export const standardCommands = [
  inputCommand,
  literalCommand,
  jsEvalCommand,
  modelCallCommand,
  graphPathCommand,
  aggregateCommand,
  fractionCommand,
  ...containerCommands
];

export function createStandardCommands() {
  return standardCommands.map((command) => ({ ...command }));
}

export {
  inputCommand,
  literalCommand,
  jsEvalCommand,
  modelCallCommand,
  graphPathCommand,
  aggregateCommand,
  fractionCommand,
  containerCommands
};
