#!/usr/bin/env node
/**
 * Capability-preservation view of the trainer export (DS009, "Capability
 * preservation"; analysis decision D-B).
 *
 * The probes measure what the narrow compiled-plan mixture costs: the untuned
 * base passes 4 of 10 capability probes and every fine-tuned arm passes 0 or 1,
 * nearly always by answering a JavaScript or instruction item with prose. The
 * next recipe variable is therefore a mixture with a small share of material
 * that exercises the substrate the compilation task depends on, and this module
 * derives that material from the dataset itself instead of importing another
 * corpus: every circuit already carries a complete deterministic calculation,
 * so the same statement asked as "write JavaScript that prints the answer"
 * yields a target that is the same computation in a different output language.
 *
 * The derivation is a real transformation, not a template: the circuit is parsed
 * with the runtime parser, each wire becomes a `const` binding of the same name,
 * `$name` references become those bindings, `literal` wires keep their JSON body,
 * and every `jsEval` body keeps its probe harness inside its own async closure,
 * so the derived program prints exactly the answer the circuit returns. A test
 * executes derived programs on both sides and compares the two answers, because
 * a preservation target that computes a different value would teach the student
 * to be wrong in a second language.
 *
 * The sample is a stride over the export order (ratio 0.1 -> every tenth row),
 * so it is reproducible without a random seed, spread over every book, and
 * recorded in the export manifest together with the profile id, the system
 * prompt hash, and the file hash.
 */

import { createHash } from 'node:crypto';
import { parseCircuit } from '../runtime/parser.mjs';

/** The share of the export repeated as preservation rows, recorded in the manifest. */
export const PRESERVATION_RATIO = 0.1;

export const PRESERVATION_PROFILE_ID = 'js-preservation-1';

/**
 * The system prompt of the preservation profile: the same statement, the other
 * output language. Hashing it pins the exact text, exactly as the SOP profile.
 */
export const PRESERVATION_SYSTEM_PROMPT = [
  'You write JavaScript.',
  'Read the task and output only one complete JavaScript program that prints exactly one line to standard output: the answer.',
  'The program carries the values it needs, computes the answer deterministically, and prints it with console.log.',
  'Output only the program.',
].join(' ');

export const PRESERVATION_SYSTEM_PROMPT_SHA256 = createHash('sha256')
  .update(PRESERVATION_SYSTEM_PROMPT, 'utf8')
  .digest('hex');

const WIRE_REFERENCE = /\$([A-Za-z_][A-Za-z0-9_]*)/g;

/**
 * The binding prefix of the derived program. The circuit's own bodies begin by
 * aliasing a wire into a local of the same name (`const slots = $slots;`), so a
 * derived program that named its bindings exactly like the wires would rewrite
 * that line into a self-reference inside the same closure. Prefixing the outer
 * bindings keeps every body byte-identical apart from its `$name` references,
 * and no wire name can collide with the prefix because the family validator
 * restricts wire names to lowercase letters and digits.
 */
const BINDING_PREFIX = 'w_';

function substituteWireReferences(body, names) {
  return body.replace(WIRE_REFERENCE, (match, name) => (names.has(name) ? `${BINDING_PREFIX}${name}` : match));
}

/**
 * The standalone JavaScript program of one dataset circuit: the same wires in
 * the same order, bound as `const` declarations inside one async closure, with
 * the answer printed as the single line of output the profile asks for.
 */
export function standaloneJavaScriptOf(solution) {
  const { wires } = parseCircuit(solution, { sourceName: 'solution.sop' });
  const names = new Set(wires.map((wire) => wire.name));
  if (!names.has('answer')) {
    throw new Error('the circuit has no answer wire, so there is no answer to print');
  }
  const lines = ['(async () => {'];
  for (const wire of wires) {
    const binding = `${BINDING_PREFIX}${wire.name}`;
    if (wire.command === 'jsEval') {
      lines.push(`  const ${binding} = await (async () => {`);
      lines.push(substituteWireReferences(wire.body, names));
      lines.push('  })();');
      continue;
    }
    // A `literal` wire carries its JSON body verbatim, exactly as the circuit does.
    lines.push(`  const ${binding} = ${wire.body};`);
  }
  lines.push('  console.log(String(w_answer));');
  lines.push('})();');
  return `${lines.join('\n')}\n`;
}

/** The stride of the sample: one preservation row every `stride` export rows. */
export function preservationStride(ratio = PRESERVATION_RATIO) {
  if (!(ratio > 0) || ratio > 1) {
    throw new Error(`the preservation ratio must be inside (0, 1], got ${ratio}`);
  }
  return Math.max(1, Math.round(1 / ratio));
}

function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * The preservation rows of an export: the sampled statements with the derived
 * JavaScript as the assistant target. Every row keeps the metadata of the
 * example it came from — including its folder, so the trainer's validation-slice
 * exclusion and its subset selection apply to the same folders — and adds
 * `kind: 'preservation'` plus the hash of the derived target.
 */
export function preservationRowsOf(rows, { ratio = PRESERVATION_RATIO } = {}) {
  const stride = preservationStride(ratio);
  const selected = rows.filter((_, index) => index % stride === 0);
  return selected.map((row) => {
    const target = standaloneJavaScriptOf(row.solution);
    return {
      book: row.book,
      folder: row.folder,
      statement: row.statement,
      solution: target,
      messages: [
        { role: 'system', content: PRESERVATION_SYSTEM_PROMPT },
        { role: 'user', content: row.statement },
        { role: 'assistant', content: target },
      ],
      meta: {
        ...row.meta,
        kind: 'preservation',
        hashes: { ...row.meta.hashes, target: sha256(target).slice(0, 12) },
      },
    };
  });
}

/** The file name of the preservation view inside the trainer data directory. */
export function preservationFileName(ratio = PRESERVATION_RATIO) {
  return `preservation-${String(Math.round(ratio * 100)).padStart(2, '0')}.jsonl`;
}

/** The manifest record of the preservation view: what a run must name to be traceable. */
export function preservationManifestOf(rows, { ratio = PRESERVATION_RATIO, sourceSnapshot = null } = {}) {
  const stride = preservationStride(ratio);
  return {
    profile: { id: PRESERVATION_PROFILE_ID, systemPromptSha256: PRESERVATION_SYSTEM_PROMPT_SHA256 },
    ratio,
    stride,
    rows: rows.length,
    sourceSnapshot,
    derivation: 'training/preservation.mjs 1.0.0: each sampled circuit is re-emitted as standalone JavaScript with the same wires bound as constants and the answer printed by console.log',
  };
}
