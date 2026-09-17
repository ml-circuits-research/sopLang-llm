/**
 * Structured errors for the SOP Lang runtime.
 *
 * Every failure that the runtime can report to a caller carries a stable code so
 * callers and tests can branch on it. The codes used by the kernel are:
 *
 * - parse_error          the source is not a valid SOP Lang program
 * - unknown_command      a wire names a command that is not registered
 * - unknown_dependency   a wire references a value that is not declared
 * - unknown_wire         a metaprogramming operation targets a missing wire
 * - duplicate_wire       a metaprogramming operation would create a wire twice
 * - unknown_output       the requested output wire does not exist
 * - cycle_detected       the active dependency graph is cyclic
 * - validation_error     a wire body or command payload is invalid
 * - missing_input        an input wire has no value bound by the wrapper
 * - stale_definition     a redefinition used an outdated expectedDefinitionHash
 * - effect_not_permitted a wire used a runtime API outside its effect class
 * - unsupported_operation a runtime API exists but is not part of this increment
 * - execution_error      a wire executor failed while producing its value
 * - budget_exceeded      a declared resource limit was reached
 */

export class SopError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'SopError';
    this.code = code;
    this.details = details;
  }
}

export function toErrorInfo(error) {
  if (error instanceof SopError) {
    const info = { code: error.code, message: error.message };
    if (error.details && Object.keys(error.details).length > 0) {
      info.details = error.details;
    }
    return info;
  }
  if (error instanceof Error) {
    return { code: 'execution_error', message: error.message };
  }
  return { code: 'execution_error', message: String(error) };
}
