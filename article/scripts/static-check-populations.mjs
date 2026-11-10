// The static checker's bloat indicator on the compact-target (dv7) and split-target (dv8) dataset trees, with the
// population it counts (Informatica, Section 5.3). Extracts training-data/ at each commit into a temporary
// directory with `git archive` and runs skills/data-quality/scripts/static-check.mjs on it (no model; the checker's
// report goes to the temporary directory).
// Usage: node article/scripts/static-check-populations.mjs
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
for (const [label, commit] of [['dv7 compact targets', '9aba95b08'], ['dv8 split targets', '9a561fccd']]) {
  const directory = mkdtempSync(join(tmpdir(), 'static-check-'));
  try {
    const archive = execFileSync('git', ['archive', '--format=tar', commit, 'training-data'], { cwd: root, maxBuffer: 1 << 30 });
    execFileSync('tar', ['-x', '-C', directory], { input: archive });
    // --report points into the temporary directory, so the checker's default report file in the repository is untouched.
    const output = execFileSync('node', [join(root, 'skills/data-quality/scripts/static-check.mjs'), '--training-data', join(directory, 'training-data'), '--report', join(directory, 'report.md')],
      { cwd: root, maxBuffer: 1 << 28, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } });
    const keep = output.split('\n').filter((line) => /solution\.sop files scanned|jsEval bodies|total wires|average wires per plan|jsEval lines per|plans with <= 3 wires/i.test(line));
    const files = execFileSync('bash', ['-c', `cd '${join(directory, 'training-data')}' && find . -name solution.sop | awk -F/ '{print ($3=="eval"?"eval":"train") "/" $2}' | sort | uniq -c`], { encoding: 'utf8' });
    console.log(`== ${label} @ ${commit}\n${keep.map((line) => '  ' + line.trim()).join('\n')}\n  solution.sop files by split and book:\n${files.split('\n').filter(Boolean).map((line) => '    ' + line.trim()).join('\n')}`);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}
