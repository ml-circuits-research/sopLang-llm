#!/usr/bin/env bash
# The abstraction-learning loop, run after every experiment closes: re-measure
# the shipped circuits with the deterministic discovery analyzer and the static
# data-quality checker, refresh their reports, and deliver the summary.
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"
while [ ! -f evaluation/registry/exp021-final.txt ]; do sleep 300; done
note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> evaluation/registry/overnight-pipeline.log; }
note "abstraction loop: exp-021 closed; re-measuring the shipped circuits"
node skills/wire-discovery/scripts/discover-wires.mjs > skills/wire-discovery/last-report.md 2>&1
node skills/data-quality/scripts/static-check.mjs > skills/data-quality/last-report.md 2>&1
note "abstraction loop: reports refreshed"
{
  echo "=== abstraction loop after exp-021 (dv7, containers) ==="
  grep -E "solution.sop files|distinct shapes|wire commands" skills/wire-discovery/last-report.md | head -4
  grep -E "flagged|suggestion=container|suggestion=aggregate|suggestion=fraction|suggestion=graphPath" skills/data-quality/last-report.md | head -6
} > evaluation/registry/loop-final.txt 2>&1
