import { parseCircuit } from './parser.mjs';
import { buildGraph } from './graph.mjs';
import { createRegistry } from './registry.mjs';
import { Budget, DEFAULT_BUDGETS } from './budget.mjs';
import { TraceLog, recordFailure, createReplayIndex } from './trace.mjs';
import { SopError, toErrorInfo } from './errors.mjs';
import { ContainerStore } from './containers.mjs';
import { createStandardCommands } from '../wires/standard/index.mjs';
import { assertSchemaSupported } from './schema.mjs';
import { createJsSandbox } from './sandbox.mjs';
import { copyValue, freezeValue } from './values.mjs';
import { executeEpochs, mustDeferForCommit, describeDependencies, definitionSnapshot, invalidateDownstream } from './executor.mjs';

/**
 * SOP Lang runtime kernel.
 *
 * The kernel is the run entry point. It validates the program and the declared
 * contracts, binds the request inputs as immutable snapshots, records the trace,
 * and delegates epoch execution to `runtime/executor.mjs`. The evaluator,
 * container store, graph, transaction layer, and JavaScript sandbox it composes
 * are specified in DS002-sop-lang-core.md, DS004-wire-types.md, and
 * DS005-containers.md.
 *
 * Run status values:
 *
 * - completed  the requested outputs were produced
 * - partial    a budget or an unresolved dependency ended the run with staged progress
 * - failed     validation or execution prevented any output
 *
 * Every outcome carries a trace, and malformed input is normalized into a
 * failed outcome instead of a rejected promise, so a dataset worker can reject
 * one candidate without aborting its batch.
 */

export class CircuitRuntime {
  constructor({ registry, models = {}, now, budgets = {}, javascript = {} } = {}) {
    this.registry = registry ?? createRegistry(createStandardCommands());
    this.models = models;
    this.now = typeof now === 'function' ? now : () => Date.now();
    this.budgets = { ...DEFAULT_BUDGETS, ...budgets };
    this.javascript = javascript;
    this.sandbox = javascript.sandbox ?? createJsSandbox(javascript);
  }

  async run(program, options = {}) {
    const {
      inputs = {},
      outputs = ['output'],
      mode = 'execute',
      replayFrom = null,
      budget = {},
      outputSchema = null,
      containers = null,
      models = null,
      controlRoots = []
    } = options;

    const limits = new Budget({ ...this.budgets, ...budget });
    const trace = new TraceLog({ circuitRevision: 0 });
    const source = typeof program === 'string' ? program : program.source;
    const sourceName = typeof program === 'string' ? (options.sourceName ?? 'inline') : program.sourceName;

    let parsed;
    try {
      parsed = parseCircuit(source, { sourceName });
      if (outputSchema !== null && outputSchema !== undefined) {
        assertSchemaSupported(outputSchema, { context: 'declared output schema' });
      }
    } catch (error) {
      return this.failureResult({ error, trace, limits, state: null });
    }

    let state;
    try {
      state = this.createState({
        parsed,
        inputs,
        registry: this.registry,
        store: containers ?? new ContainerStore(),
        models: models === null ? this.models : { ...this.models, ...models },
        mode,
        replayFrom,
        trace
      });
    } catch (error) {
      return this.failureResult({ error, trace, limits, state: null });
    }

    try {
      this.validateWires(state.graph.nodes.values());
      return await executeEpochs(this, { state, trace, outputs, limits, outputSchema, controlRoots });
    } catch (error) {
      return this.failureResult({ error, trace, limits, state });
    }
  }

  createState({ parsed, inputs, registry, store, models, mode, replayFrom, trace }) {
    const graph = buildGraph({
      wires: parsed.wires,
      inputBindings: new Set(Object.keys(inputs)),
      registry
    });
    const boundInputs = new Map();
    for (const [name, value] of Object.entries(inputs)) {
      boundInputs.set(name, freezeValue(copyValue(value, { wire: name, role: 'input value' })));
    }
    return {
      graph,
      revision: 1,
      epoch: 0,
      inputs: boundInputs,
      values: new Map(),
      outputHashes: new Map(),
      dirty: new Set(),
      stagedPatches: [],
      epochPatchMark: 0,
      stagedTransactions: [],
      appliedTransactions: new Map(),
      stagedEffects: [],
      containers: store,
      models,
      replay: mode === 'replay' ? createReplayIndex(replayFrom) : null,
      mode,
      trace,
      createdAt: graph.createdAt,
      definitionSnapshot: { revision: null, text: null }
    };
  }

  failureResult({ error, trace, limits, state, outputs = [], recorded = false }) {
    const info = toErrorInfo(error);
    if (!recorded) {
      recordFailure(trace, { error: info, circuitRevision: state === null ? trace.circuitRevision : state.revision });
    }
    return {
      status: info.code === 'budget_exceeded' ? 'partial' : 'failed',
      code: info.code,
      error: info,
      outputs: {},
      epochs: state === null ? 0 : state.epoch,
      trace: trace.toJSON(),
      budgets: limits.toJSON(),
      containers: state === null ? [] : state.containers.definitions()
    };
  }

  wireFailure({ error, node, state, trace, limits, outputs, startedAt }) {
    const info = toErrorInfo(error);
    recordFailure(trace, {
      error: info,
      epoch: state.epoch,
      circuitRevision: state.revision,
      wire: node.name,
      command: node.command.name,
      commandVersion: node.command.version,
      definitionHash: node.definitionHash,
      dependencies: this.describeDependencies({ node, state }),
      startedAt,
      finishedAt: this.now()
    });
    return this.failureResult({ error, trace, limits, state, outputs, recorded: true });
  }

  validateWires(nodes) {
    for (const node of nodes) {
      if (node.isInput) {
        continue;
      }
      const result = node.command.validate({ body: node.body, wire: node.name });
      if (result !== null && result !== undefined && result.ok === false) {
        throw new SopError('validation_error', `Wire "${node.name}" failed validation: ${result.message}`, {
          wire: node.name,
          command: node.command.name
        });
      }
    }
  }

  mustDeferForCommit(request) {
    return mustDeferForCommit(request);
  }

  describeDependencies(request) {
    return describeDependencies(request);
  }

  invalidateDownstream(state, name) {
    return invalidateDownstream(state, name);
  }

  createContext({ node, state, values, limits, transaction, trace, epoch }) {
    const runtime = this;
    return {
      wire: node.name,
      body: node.body,
      values,
      dependencies: node.dependencies.values,
      definitionHash: node.definitionHash,
      models: state.models,
      budget: limits,
      containers: state.containers,
      javascript: { ...this.javascript, sandbox: this.sandbox },
      epoch,
      mode: state.mode,
      trace,
      circuit: transaction,
      recordStructuralReads(names, prefixes) {
        transaction.noteStructuralReads(names, prefixes);
      },
      definitionsSnapshot() {
        return definitionSnapshot(state);
      },
      replayGeneration(request) {
        return runtime.replayGeneration({ state, wire: node.name, request });
      },
      stagePatch(patch) {
        const staged = state.containers.stagePatch({
          ...patch,
          sourceWire: node.name,
          epoch,
          sequence: state.stagedPatches.length
        });
        state.stagedPatches.push(staged);
        return staged;
      },
      stageEffect(effect) {
        state.stagedEffects.push(effect);
        return effect;
      },
      listContainers() {
        return state.containers.definitions();
      }
    };
  }

  /**
   * Exact replay. A recorded observation is bound to the wire definition, the
   * command implementation, and the hashes of the dependency values it was
   * computed from, so a mismatch is rejected instead of returning a stale
   * answer, and the substituted observation keeps its provenance.
   */
  replayGeneration({ state, wire, request }) {
    if (state.replay === null) {
      return null;
    }
    const captured = state.replay.capture({ wire, ...request });
    if (captured.ok) {
      return captured;
    }
    throw new SopError('replay_mismatch', `Replay of wire "${wire}" is not valid: ${captured.reason}`, {
      wire,
      reason: captured.reason
    });
  }
}

export function createRuntime(options = {}) {
  return new CircuitRuntime(options);
}

export { buildGraph, SopError, toErrorInfo };
