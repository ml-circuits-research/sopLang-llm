import { SopError } from './errors.mjs';

/**
 * Effect-class capability checks.
 *
 * A command declares an effect class and may use only the runtime APIs that
 * class permits. The runtime checks the contract after each wire executes so a
 * violation is reported as `effect_not_permitted` instead of silently accepted:
 *
 * - pure             reads values and stages nothing
 * - container_patch  may stage container patches
 * - neural           may invoke a model and stage no structural change
 * - metaprogramming  may stage circuit transactions and container patches
 *
 * A command may additionally declare conditional staging through `mayStage`.
 * `jsEval` uses this because its contract is "pure unless it explicitly stages
 * effects": a body that touches the circuit API or stages a container patch
 * changes the wire into an effect-producing wire for that evaluation, and the
 * trace records the staged effects. A command without the declaration is bound
 * to its declared class.
 *
 * Staging a structural transaction also requires the command to be a graph
 * metaprogramming surface. This keeps the scheduler able to treat every other
 * wire as a value producer while still allowing `jsEval` to expand a circuit.
 */

export const EFFECT_CLASSES = Object.freeze(['pure', 'container_patch', 'neural', 'metaprogramming']);

export const STAGEABLE_EFFECTS = Object.freeze(['container_patch', 'structural_transaction']);

export function assertEffectClassKnown(effectClass) {
  if (!EFFECT_CLASSES.includes(effectClass)) {
    throw new SopError('validation_error', `Unknown effect class "${effectClass}".`, { effectClass });
  }
}

export function assertStagingPermitted({ command, wire, staged }) {
  const stagedEffects = new Set(staged);
  if (stagedEffects.size === 0) {
    return;
  }

  assertEffectClassKnown(command.effectClass);
  const declared = command.mayStage ?? [];
  const permitted = new Set(declared);

  if (command.effectClass === 'container_patch') {
    permitted.add('container_patch');
  }
  if (command.effectClass === 'metaprogramming') {
    permitted.add('container_patch');
    permitted.add('structural_transaction');
  }

  for (const effect of stagedEffects) {
    if (!STAGEABLE_EFFECTS.includes(effect)) {
      throw new SopError('validation_error', `Unknown staged effect "${effect}".`, { wire, effect });
    }
    if (!permitted.has(effect)) {
      throw new SopError(
        'effect_not_permitted',
        `Wire "${wire}" staged a ${effect} but command "${command.name}" declares effect class "${command.effectClass}" without that permission.`,
        { wire, command: command.name, effectClass: command.effectClass, effect }
      );
    }
  }
}
