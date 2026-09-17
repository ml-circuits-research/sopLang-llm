/**
 * Command registry.
 *
 * A command carries execution semantics and dependency-analysis semantics
 * together with its model-visible manifest. The registry resolves the standard
 * vocabulary and the installable `.mjs` wire types through one interface, so
 * the runtime never needs command-specific scheduling paths.
 *
 * Command lookup is case-insensitive so a declaration resolves regardless of
 * the capitalization a model emits, while each command keeps its canonical
 * registered spelling for the trace, the manifest, and the capability catalog.
 */

import { SopError } from './errors.mjs';

export function normalizeLookupKey(command) {
  return String(command).trim().toLowerCase();
}

export class CommandRegistry {
  constructor() {
    this.commands = new Map();
  }

  register(command, { replace = true } = {}) {
    if (command === null || typeof command !== 'object') {
      throw new SopError('validation_error', 'A command definition must be an object.');
    }
    const name = String(command.name ?? '').trim();
    if (name === '') {
      throw new SopError('validation_error', 'A command definition requires a name.');
    }
    if (typeof command.execute !== 'function') {
      throw new SopError('validation_error', `Command "${name}" requires an execute function.`);
    }
    if (typeof command.analyze !== 'function') {
      throw new SopError('validation_error', `Command "${name}" requires an analyze function.`);
    }
    const key = normalizeLookupKey(name);
    if (this.commands.has(key) && !replace) {
      throw new SopError('validation_error', `Command "${name}" is already registered.`, { command: name });
    }
    const definition = Object.freeze({
      name,
      version: String(command.version ?? '0.0.0'),
      effectClass: String(command.effectClass ?? 'pure'),
      mayStage: Array.isArray(command.mayStage) ? [...command.mayStage] : [],
      determinism: String(command.determinism ?? 'deterministic'),
      manifest: command.manifest ?? null,
      analyze: command.analyze,
      validate: typeof command.validate === 'function' ? command.validate : () => ({ ok: true }),
      execute: command.execute
    });
    this.commands.set(key, definition);
    return definition;
  }

  get(name) {
    return this.commands.get(normalizeLookupKey(name)) ?? null;
  }

  has(name) {
    return this.commands.has(normalizeLookupKey(name));
  }

  require(name) {
    const command = this.get(name);
    if (command === null) {
      throw new SopError('unknown_command', `Command "${name}" is not registered.`, { command: String(name) });
    }
    return command;
  }

  names() {
    return [...this.commands.values()].map((command) => command.name).sort();
  }

  keys() {
    return [...this.commands.keys()].sort();
  }

  manifests() {
    return this.names()
      .map((name) => this.get(name).manifest)
      .filter((manifest) => manifest !== null);
  }
}

export function createRegistry(commands = []) {
  const registry = new CommandRegistry();
  for (const command of commands) {
    registry.register(command);
  }
  return registry;
}
