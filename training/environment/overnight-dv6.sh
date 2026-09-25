#!/usr/bin/env bash
# The dv6 stage: after exp-019's chain closes, rebuild with the book-shape
# families and train exp-020 on the best base measured.
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"
note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> evaluation/registry/overnight-pipeline.log; }
source "$(dirname "${BASH_SOURCE[0]}")/lib-watch.sh"
wait_chain exp-019-1.7b-qwen3-dv5
note "exp-019 closed; rebuilding with the dv6 book-shape families"
printf '6\n' > training-data/VERSION
printf 'book shapes: dependency chain-and-join, minimal winning coalition, route bottleneck, evidence-tree elimination (2026-09-25)\n' > training-data/VERSION.label
printf '6: book shapes - dependency chain-and-join, minimal winning coalition, route bottleneck, evidence-tree elimination (2026-09-25)\n' >> training-data/VERSION.history
if ! node training/environment/rebuild-all.mjs >> evaluation/registry/overnight-pipeline.log 2>&1; then
  note "REBUILD FAILED; stopping for a human" >&2; exit 3
fi
if ! node training-data/verify.mjs >> evaluation/registry/overnight-pipeline.log 2>&1; then
  note "VERIFY FAILED; stopping for a human" >&2; exit 3
fi
if ! node training/export.mjs >> evaluation/registry/overnight-pipeline.log 2>&1; then
  note "EXPORT FAILED; stopping for a human" >&2; exit 3
fi
if ! npm test > /tmp/dv6-tests.out 2>&1; then
  note "TEST SUITE FAILED after the dv6 rebuild; stopping for a human (see /tmp/dv6-tests.out)" >&2; exit 3
fi
note "dv6 rebuilt and verified; launching exp-020"
bash training/environment/start-detached.sh train exp-020-1.7b-qwen3-dv6 --epochs 2 --lr 1e-4 --batch-size 4 --grad-accum 8 --gradient-checkpointing --save-steps 150 --extra-data training/data/preservation-10.jsonl --patience 5 --base-model training/models/qwen3-1.7b --model-manifest training/environment/base-model-qwen3-17b.json >> evaluation/registry/overnight-pipeline.log 2>&1
wait_chain exp-020-1.7b-qwen3-dv6
winner="$(python3 -c "import json; print(json.load(open('evaluation/registry/exp-020-1.7b-qwen3-dv6/selection.json'))['winner'])" 2>/dev/null || true)"
rm -rf "training/checkpoints/exp-020-1.7b-qwen3-dv6/checkpoint-"*
if [ -n "$winner" ]; then
  for gguf in evaluation/registry/exp-020-1.7b-qwen3-dv6/gguf/checkpoint-*.gguf; do
    [ -f "$gguf" ] || continue
    case "$(basename "$gguf")" in "$winner.gguf") ;; *) rm -f "$gguf";; esac
  done
fi
note "DV6 STAGE COMPLETE"
{
  echo "=== exp-020 (Qwen3-1.7B, dv6 book shapes) ==="
  grep -E "oracle match|capability probes" evaluation/registry/exp-020-1.7b-qwen3-dv6/series.log | tail -2
  echo "=== books ==="
  python3 -c "import json; m=json.load(open('evaluation/registry/exp-020-1.7b-qwen3-dv6/metrics.json')); books=sum(v['classes'].get('answer_match',0) for k,v in m['byBook'].items() if k!='procedural-arithmetic'); print(f'books {books}/225')"
} > evaluation/registry/dv6-final.txt 2>&1
