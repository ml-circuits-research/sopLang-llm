/**
 * Resource budgets.
 *
 * A request declares limits for epochs, created wires, neural calls, JavaScript
 * time, output bytes, and structural transaction operations. Exceeding a limit
 * yields a structured `budget_exceeded` outcome with the trace of partial
 * progress instead of an invented answer.
 */

import { SopError } from './errors.mjs';

export const DEFAULT_BUDGETS = Object.freeze({
  maxEpochs: 64,
  maxCreatedWires: 2000,
  maxNeuralCalls: 64,
  maxJsTimeMs: 2000,
  maxOutputBytes: 1_000_000,
  maxTransactionOps: 500
});

export class Budget {
  constructor(overrides = {}) {
    const merged = { ...DEFAULT_BUDGETS, ...overrides };
    for (const [key, value] of Object.entries(merged)) {
      if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
        throw new SopError('validation_error', `Budget "${key}" must be a non-negative number.`, { budget: key });
      }
    }
    this.limits = Object.freeze(merged);
    this.usage = {
      epochs: 0,
      createdWires: 0,
      neuralCalls: 0,
      jsTimeMs: 0,
      outputBytes: 0,
      transactionOps: 0
    };
  }

  charge(counter, amount, context = {}) {
    const limitKey = `max${counter[0].toUpperCase()}${counter.slice(1)}`;
    const limit = this.limits[limitKey];
    this.usage[counter] += amount;
    if (limit !== undefined && this.usage[counter] > limit) {
      throw new SopError('budget_exceeded', `Budget "${limitKey}" of ${limit} was exceeded.`, {
        budget: limitKey,
        limit,
        used: this.usage[counter],
        ...context
      });
    }
  }

  toJSON() {
    return { limits: this.limits, usage: { ...this.usage } };
  }
}
