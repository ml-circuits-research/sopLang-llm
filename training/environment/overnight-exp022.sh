#!/usr/bin/env bash
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"
note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> evaluation/registry/overnight-pipeline.log; }
source "$(dirname "${BASH_SOURCE[0]}")/lib-watch.sh"
wait_chain exp-022-1.7b-qwen3-dv8
winner="$(python3 -c "import json; print(json.load(open('evaluation/registry/exp-022-1.7b-qwen3-dv8/selection.json'))['winner'])" 2>/dev/null || true)"
rm -rf "training/checkpoints/exp-022-1.7b-qwen3-dv8/checkpoint-"*
if [ -n "$winner" ]; then
  for gguf in evaluation/registry/exp-022-1.7b-qwen3-dv8/gguf/checkpoint-*.gguf; do
    [ -f "$gguf" ] || continue
    case "$(basename "$gguf")" in "$winner.gguf") ;; *) rm -f "$gguf";; esac
  done
fi
note "EXP-022 COMPLETE"
{
  echo "=== the structure experiment: dv7 vs dv8, same base, same recipe ==="
  for exp in exp-021-1.7b-qwen3-dv7 exp-022-1.7b-qwen3-dv8; do
    python3 -c "
import json
m = json.load(open('evaluation/registry/$exp/metrics.json'))
books = sum(v['classes'].get('answer_match', 0) for k, v in m['byBook'].items() if k != 'procedural-arithmetic')
print('$exp:', m['classes']['answer_match'], 'of', m['items'], f\"({m['rates']['oracle_match']*100:.1f}%)\", '| books', books, '/225 | exec_errors', m['classes']['execution_error'])"
  done
  echo "=== bloat indicator (shipped dv8) ==="
  NO_COLOR=1 node skills/data-quality/scripts/static-check.mjs 2>&1 | grep -E "average|bloat|lines per wire" | head -4
} > evaluation/registry/structure-final.txt 2>&1
