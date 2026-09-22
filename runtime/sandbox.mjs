/**
 * JavaScript execution for the `jsEval` command and filter predicates.
 *
 * Generated code runs in a private guest realm inside a worker thread:
 *
 * - The worker creates a fresh ECMAScript context for every call. The context
 *   contains only ECMAScript intrinsics, so guest code cannot reach `process`,
 *   `require`, the module loader, or any host object.
 * - Values enter and leave the guest realm as transfer profile text. The guest
 *   never receives a reference to a host object, so a mutation inside the guest
 *   cannot reach a caller value, a stored value, or a container revision.
 * - The `circuit` parameter is a guest-realm facade over the transactional
 *   circuit API. It records operations and structural reads in the guest realm;
 *   the runtime replays them onto the real transaction after the call.
 * - Execution is bounded. The synchronous part of a call runs under the guest
 *   realm's script timeout, and the worker is terminated when the call exceeds
 *   its JavaScript deadline, so a nonterminating body ends as a structured
 *   `budget_exceeded` outcome instead of blocking the runtime.
 *
 * A syntax failure is reported as `validation_error`, a body failure as
 * `execution_error`, a non-transferable dependency or result as
 * `unsupported_value`, and exhausted execution time as `budget_exceeded`.
 */

import { Worker } from 'node:worker_threads';
import { SopError } from './errors.mjs';
import { assertWireName } from './identifiers.mjs';
import { TRANSFER_CODEC_SOURCE, encodeValue, decodeValue } from './values.mjs';

export const DEFAULT_JS_TIMEOUT_MS = 2000;
const DEFAULT_MAX_OPERATIONS = 5000;

const GUEST_BOOTSTRAP_SOURCE = `
// The probe helper is provided by the sandbox, not by the circuit body. A body that
// writes its own domain assertions calls probe(...) directly; a body that declares
// its own helper (an artifact trained before the compact-target change) shadows this
// binding inside its own function scope, so both forms run. The helper is identical
// text in every target, so it belongs here, exactly like the input and output
// contract of the jsEval command.
const probe = (condition, message) => {
  if (!condition) {
    throw new Error("probe failed: " + message);
  }
};

${TRANSFER_CODEC_SOURCE}

function budgetFailure(message, details) {
  const error = new Error(message);
  error.sopCode = 'budget_exceeded';
  error.sopDetails = details;
  return error;
}

globalThis.__sopInvoke = async function __sopInvoke(requestText) {
  const request = JSON.parse(requestText);

  const operations = [];
  const structuralReads = [];
  const listReads = [];
  let committed = false;
  let commitKey = null;

  const failure = (code, message, details) => {
    try {
      return encodeTransfer({ ok: false, code, message, details: details === undefined ? null : details });
    } catch (error) {
      return JSON.stringify({ ok: false, code: 'unsupported_value', message: String(error.message) });
    }
  };

  if (typeof request.body !== 'string') {
    return failure('validation_error', 'the wire body must be a string');
  }

  const definitions = new Map();
  if (request.definitions !== null) {
    for (const entry of JSON.parse(request.definitions)) {
      definitions.set(entry.name, entry);
    }
  }

  const requireName = (name) => {
    const text = String(name);
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(text)) {
      throw transferFailure('$circuit', 'invalid wire name "' + text + '"');
    }
    return text;
  };

  const requireDefinition = (definition) => {
    if (definition === undefined || definition === null) {
      return {};
    }
    if (typeof definition !== 'object' || Array.isArray(definition)) {
      throw transferFailure('$circuit', 'a wire definition must be an object');
    }
    if (operations.length >= request.maxOperations) {
      throw budgetFailure('operation ' + String(operations.length + 1) + ' exceeds the transaction operation budget', {
        budget: 'maxTransactionOps'
      });
    }
    return definition;
  };

  const stageOperation = (operation, name, definition) => {
    const wireName = requireName(name);
    const payload = requireDefinition(definition);
    operations.push({ operation, name: wireName, definition: payload });
    return { operation, name: wireName };
  };

  const circuit = Object.freeze({
    addWire(name, definition) { return stageOperation('addWire', name, definition); },
    redefineWire(name, definition) { return stageOperation('redefineWire', name, definition); },
    invalidateWire(name, definition) { return stageOperation('invalidateWire', name, definition); },
    invalidateDownstream(name, definition) { return stageOperation('invalidateDownstream', name, definition); },
    getDefinition(name) {
      const key = String(name);
      structuralReads.push(key);
      const entry = definitions.get(key);
      if (entry === undefined) {
        return { name: key, known: false };
      }
      return {
        name: key,
        known: true,
        command: entry.command,
        version: entry.version,
        definitionHash: entry.definitionHash,
        body: entry.body
      };
    },
    listDefinitions(filter) {
      const prefix = String((filter !== null && filter !== undefined && filter.prefix) || '');
      listReads.push(prefix);
      const result = [];
      for (const entry of definitions.values()) {
        if (entry.name.indexOf(prefix) === 0) {
          result.push({ name: entry.name, command: entry.command, version: entry.version, definitionHash: entry.definitionHash });
        }
      }
      result.sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0));
      return result;
    },
    commit(options) {
      committed = true;
      commitKey = options === null || options === undefined || options.key === undefined ? null : options.key;
      return options === null || options === undefined ? undefined : options.result;
    }
  });

  let values;
  try {
    values = request.values === null ? {} : decodeTransfer(request.values);
  } catch (error) {
    return failure(error.sopCode || 'unsupported_value', String(error.message));
  }
  if (values === null || typeof values !== 'object' || Array.isArray(values)) {
    return failure('validation_error', 'the dependency values must be a mapping');
  }

  const names = Object.keys(values);
  const parameters = [];
  for (const name of names) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
      return failure('validation_error', 'invalid dependency name "' + name + '"');
    }
    parameters.push('$' + name);
  }
  parameters.push('circuit');

  let body;
  try {
    body = (0, eval)('(async function (' + parameters.join(', ') + ') {\\n' + request.body + '\\n})');
  } catch (error) {
    return failure('validation_error', 'the body could not be compiled: ' + String(error && error.message ? error.message : error));
  }

  try {
    const args = names.map((name) => values[name]);
    args.push(circuit);
    const value = await body.apply(undefined, args);
    return encodeTransfer({ ok: true, value, operations, structuralReads, listReads, committed, commitKey });
  } catch (error) {
    const code = error !== null && error !== undefined && error.sopCode ? error.sopCode : 'execution_error';
    const details = error !== null && error !== undefined && error.sopDetails !== undefined ? error.sopDetails : undefined;
    return failure(code, String(error !== null && error !== undefined && error.message ? error.message : error), details);
  }
};
`;

const WORKER_SOURCE = `
const { parentPort } = require('node:worker_threads');
const vm = require('node:vm');
const BOOTSTRAP = ${JSON.stringify(GUEST_BOOTSTRAP_SOURCE)};

parentPort.on('message', (message) => {
  void runCall(message);
});

async function runCall(message) {
  const { id, request, timeoutMs } = message;
  let context;
  try {
    context = vm.createContext(Object.create(null));
    vm.runInContext(BOOTSTRAP, context, { filename: 'sop-guest-bootstrap.js' });
    removeHostileIntrinsics(context);
    const requestText = JSON.stringify(request);
    const pending = vm.runInContext('__sopInvoke(' + JSON.stringify(requestText) + ')', context, {
      timeout: timeoutMs,
      filename: 'sop-guest-call.js'
    });
    const text = await pending;
    parentPort.postMessage({ id, text });
  } catch (error) {
    const timedOut = error !== null && error !== undefined && error.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT';
    parentPort.postMessage({
      id,
      error: {
        code: timedOut ? 'guest_timeout' : 'guest_error',
        message: String(error !== null && error !== undefined && error.message ? error.message : error)
      }
    });
  }
}

function removeHostileIntrinsics(context) {
  vm.runInContext(
    'delete globalThis.WebAssembly; delete globalThis.SharedArrayBuffer; delete globalThis.Atomics;',
    context,
    { filename: 'sop-guest-restrictions.js' }
  );
}
`;

let guestWorker = null;
let dispatchQueue = Promise.resolve();
let nextRequestId = 1;

/**
 * The host-side message port of a worker keeps the process alive while a
 * message listener is attached. The sandbox therefore listens only while a call
 * is in flight, so an idle runtime never blocks process exit.
 */
function startGuestWorker() {
  // `execArgv: []` is load-bearing. With `eval: true` the worker otherwise
  // inherits the parent's `execArgv`, and a host launched with a flag that
  // changes how eval workers are parsed (for example `--input-type=module`)
  // makes Node parse this CommonJS worker source as ECMAScript, so every
  // `require` inside the worker fails and no `jsEval` body can run. The guest
  // never wants host flags: its behavior is defined by this module alone.
  const worker = new Worker(WORKER_SOURCE, { eval: true, execArgv: [] });
  worker.unref();
  const entry = { worker, pending: new Map(), listening: false, onMessage: null };

  entry.onMessage = (message) => {
    const call = entry.pending.get(message.id);
    if (call === undefined) {
      return;
    }
    entry.pending.delete(message.id);
    clearTimeout(call.timer);
    stopListeningWhenIdle(entry);
    if (message.error !== undefined) {
      call.reject(message.error);
    } else {
      call.resolve(message.text);
    }
  };

  worker.on('error', (error) => {
    for (const call of entry.pending.values()) {
      clearTimeout(call.timer);
      call.reject({ code: 'guest_error', message: `The JavaScript worker failed: ${error.message}` });
    }
    entry.pending.clear();
    if (guestWorker === entry) {
      guestWorker = null;
    }
  });

  return entry;
}

function ensureListening(entry) {
  if (!entry.listening) {
    entry.worker.on('message', entry.onMessage);
    entry.listening = true;
  }
}

function stopListeningWhenIdle(entry) {
  if (entry.pending.size === 0 && entry.listening) {
    entry.worker.off('message', entry.onMessage);
    entry.listening = false;
  }
}

function abortGuestWorker(rejection) {
  const entry = guestWorker;
  if (entry === null) {
    return;
  }
  guestWorker = null;
  void entry.worker.terminate();
  for (const call of entry.pending.values()) {
    clearTimeout(call.timer);
    call.reject(rejection);
  }
  entry.pending.clear();
}

function dispatch(request, timeoutMs) {
  const call = () =>
    new Promise((resolve, reject) => {
      if (guestWorker === null) {
        guestWorker = startGuestWorker();
      }
      const id = nextRequestId;
      nextRequestId += 1;
      const timer = setTimeout(() => {
        abortGuestWorker({ code: 'guest_timeout', message: `JavaScript execution exceeded its ${timeoutMs} ms deadline.` });
      }, timeoutMs);
      ensureListening(guestWorker);
      guestWorker.pending.set(id, { resolve, reject, timer });
      guestWorker.worker.postMessage({ id, request, timeoutMs });
    });

  const result = dispatchQueue.then(call, call);
  dispatchQueue = result.catch(() => undefined);
  return result;
}

function guestFailure(wire, failure) {
  if (failure instanceof SopError) {
    return failure;
  }
  if (failure.code === 'guest_timeout') {
    return new SopError('budget_exceeded', `Wire "${wire}" exceeded its JavaScript deadline: ${failure.message}`, {
      wire,
      budget: 'maxJsTimeMs'
    });
  }
  return new SopError('execution_error', `Wire "${wire}" failed during JavaScript execution: ${failure.message}`, { wire });
}

export function createJsSandbox({ timeoutMs = DEFAULT_JS_TIMEOUT_MS } = {}) {
  const configuredTimeout = typeof timeoutMs === 'number' && timeoutMs > 0 ? timeoutMs : DEFAULT_JS_TIMEOUT_MS;

  async function invoke({ body, values = {}, wire = 'inline', budget = null, definitions = null, timeoutMs: callTimeout = null }) {
    for (const name of Object.keys(values)) {
      assertWireName(name, `dependency name of wire "${wire}"`);
    }
    const startedAt = Date.now();
    let raw;
    try {
      raw = await callGuest({
        wire,
        request: {
          body: String(body ?? ''),
          values: encodeValue(values, { wire, role: 'dependency values' }),
          definitions: definitions === null || definitions === undefined ? null : String(definitions),
          maxOperations: operationBudget(budget)
        },
        timeoutMs: effectiveTimeout({ configuredTimeout, callTimeout, budget })
      });
    } catch (failure) {
      // A failed or terminated call still consumed JavaScript time; the usage
      // counter records it while the original failure stays the outcome.
      chargeFailureTime({ budget, wire, startedAt });
      throw guestFailure(wire, failure);
    }
    const durationMs = Date.now() - startedAt;
    const envelope = decodeValue(raw, { wire, role: 'guest result' });
    if (envelope === null || typeof envelope !== 'object' || typeof envelope.ok !== 'boolean') {
      throw new SopError('execution_error', `Wire "${wire}" produced a malformed guest envelope: ${String(raw).slice(0, 200)}`, {
        wire
      });
    }
    if (envelope.ok !== true) {
      throw new SopError(envelope.code, `Wire "${wire}" failed: ${envelope.message}`, { wire, ...(envelope.details ?? {}) });
    }
    return {
      value: envelope.value,
      operations: envelope.operations,
      structuralReads: envelope.structuralReads,
      listReads: envelope.listReads,
      committed: envelope.committed === true,
      commitKey: envelope.commitKey ?? null,
      durationMs
    };
  }

  return {
    timeoutMs: configuredTimeout,
    invoke,
    async run({ body, values = {}, wire = 'inline', budget = null, definitions = null, timeoutMs: callTimeout = null }) {
      const result = await invoke({ body, values, wire, budget, definitions, timeoutMs: callTimeout });
      return result.value;
    }
  };
}

async function callGuest({ wire, request, timeoutMs }) {
  let raw;
  try {
    raw = await dispatch(request, timeoutMs);
  } catch (failure) {
    throw guestFailure(wire, failure);
  }
  return raw;
}

function chargeFailureTime({ budget, wire, startedAt }) {
  if (budget === null || budget === undefined) {
    return;
  }
  try {
    budget.charge('jsTimeMs', Math.max(1, Math.ceil(Date.now() - startedAt)), { wire });
  } catch {
    // The usage counter is already updated when a charge exceeds its limit; the
    // original failure remains the reported outcome.
  }
}

function operationBudget(budget) {
  if (budget === null || budget === undefined) {
    return DEFAULT_MAX_OPERATIONS;
  }
  const limit = budget.limits?.maxTransactionOps;
  if (typeof limit !== 'number' || !Number.isFinite(limit)) {
    return DEFAULT_MAX_OPERATIONS;
  }
  return Math.max(1, Math.ceil(limit - (budget.usage?.transactionOps ?? 0)));
}

function effectiveTimeout({ configuredTimeout, callTimeout, budget }) {
  let timeout = typeof callTimeout === 'number' && callTimeout > 0 ? callTimeout : configuredTimeout;
  if (budget !== null && budget !== undefined) {
    const limit = budget.limits?.maxJsTimeMs;
    if (typeof limit === 'number' && Number.isFinite(limit)) {
      const remaining = limit - (budget.usage?.jsTimeMs ?? 0);
      timeout = Math.min(timeout, Math.max(1, Math.ceil(remaining)));
    }
  }
  return timeout;
}
