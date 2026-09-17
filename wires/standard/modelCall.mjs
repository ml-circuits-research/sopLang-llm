import { findInstructionReferences } from '../../runtime/dependencies.mjs';
import { SopError } from '../../runtime/errors.mjs';
import { hashValue } from '../../runtime/hashing.mjs';

/**
 * `modelCall` invokes the configured neural model for a local semantic judgment.
 *
 * The body carries the local instruction and refers to dependency values with
 * `$name`. An instruction is prose, so its dependency analysis reads a `$name`
 * token wherever it appears; an apostrophe never hides an input.
 *
 * The effect class is neural and the call is fully logged: the trace records the
 * prompt, the generation, the model revision, the sampling parameters, and the
 * latency together with the definition hash and the dependency value hashes. In
 * replay mode a recorded generation is substituted only when those identities
 * match, and the substitution is recorded with the provenance of the entry it
 * replayed.
 */

export const modelCallCommand = {
  name: 'modelCall',
  version: '1.1.0',
  effectClass: 'neural',
  determinism: 'not_guaranteed',
  manifest: {
    name: 'modelCall',
    version: '1.1.0',
    summary: 'Invoke the configured neural model for a local semantic judgment or generation step.',
    whenToUse: 'Use for semantic decisions, interpretation, synthesis, or generation that no symbolic command can decide.',
    whenNotToUse: 'Do not use for arithmetic, sorting, counting, filtering, or formatting; delegate those to jsEval.',
    bodyFormat: 'instruction-text',
    syntax: '@judgment modelCall\nAre $left and $right semantically equivalent? Answer yes or no.',
    inputContract: {
      requiredDependencies: ['value'],
      notes: 'Referenced values are made available to the model as named inputs.'
    },
    outputSchema: { type: 'string' },
    effectClass: 'neural',
    determinism: 'not_guaranteed'
  },
  analyze({ body }) {
    return {
      values: findInstructionReferences(body).map((reference) => reference.name),
      structural: [],
      containerReads: [],
      containerWrites: [],
      target: null
    };
  },
  validate({ body, wire }) {
    if (String(body).trim() === '') {
      return { ok: false, message: `modelCall wire "${wire}" requires an instruction body.` };
    }
    return { ok: true };
  },
  async execute(ctx) {
    const dependencyHashes = {};
    for (const name of ctx.dependencies) {
      dependencyHashes[name] = hashValue(ctx.values[name]);
    }

    if (ctx.mode === 'replay') {
      const captured = ctx.replayGeneration({ definitionHash: ctx.definitionHash, dependencyHashes });
      if (captured === null) {
        throw new SopError('execution_error', `No recorded generation available for replay of "${ctx.wire}".`, {
          wire: ctx.wire
        });
      }
      if (ctx.trace !== undefined) {
        ctx.trace.record({
          type: 'neural_replay',
          wire: ctx.wire,
          epoch: ctx.epoch,
          command: 'modelCall',
          commandVersion: modelCallCommand.version,
          definitionHash: ctx.definitionHash,
          dependencyHashes,
          generation: { text: captured.text },
          provenance: captured.provenance
        });
      }
      return captured.text;
    }

    const model = ctx.models?.modelCall;
    if (typeof model !== 'function') {
      throw new SopError(
        'execution_error',
        'The modelCall command requires a configured model function in models.modelCall.',
        { wire: ctx.wire }
      );
    }

    ctx.budget.charge('neuralCalls', 1, { wire: ctx.wire });
    const startedAt = Date.now();
    const generation = await model({
      wire: ctx.wire,
      instruction: ctx.body,
      values: ctx.values,
      dependencies: ctx.dependencies,
      budget: ctx.budget
    });
    const finishedAt = Date.now();
    const text = typeof generation === 'string' ? generation : String(generation?.text ?? '');
    const entry = {
      type: 'neural_call',
      wire: ctx.wire,
      epoch: ctx.epoch,
      command: 'modelCall',
      commandVersion: modelCallCommand.version,
      definitionHash: ctx.definitionHash ?? null,
      dependencyHashes,
      modelRevision: generation?.modelRevision ?? ctx.models?.modelRevision ?? 'unspecified',
      sampling: generation?.sampling ?? null,
      promptTokens: generation?.promptTokens ?? null,
      completionTokens: generation?.completionTokens ?? null,
      latencyMs: generation?.latencyMs ?? finishedAt - startedAt,
      generation: { text }
    };
    if (ctx.trace !== undefined) {
      ctx.trace.record(entry);
    }
    ctx.stageEffect({ type: 'neural_call', wire: ctx.wire });
    return text;
  }
};
