/**
 * Identifier and name rules of SOP Lang.
 *
 * Wire identifiers use a conservative ASCII grammar so they can be bound
 * predictably inside JavaScript, while wire values themselves may contain
 * arbitrary Unicode. Command identities are dotted namespaces resolved from the
 * module path of an installable wire type or from the standard vocabulary.
 */

export const WIRE_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function isValidWireName(name) {
  return typeof name === 'string' && WIRE_NAME_PATTERN.test(name);
}

export function assertWireName(name, context = 'wire name') {
  if (!isValidWireName(name)) {
    const sample = typeof name === 'string' ? name : '';
    throw new Error(`${context} must match ${WIRE_NAME_PATTERN.source}, received "${sample}".`);
  }
}

export function normalizeCommandName(command) {
  return String(command).trim().toLowerCase();
}
