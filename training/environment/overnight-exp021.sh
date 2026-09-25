#!/usr/bin/env bash
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"
note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> evaluation/registry/overnight-pipeline.log; }
source "$(dirname "${BASH_SOURCE[0]}")/lib-watch.sh"
wait_chain exp-021-1.7b-qwen3-dv7
winner="$(python3 -c "import json; print(json.load(open('evaluation/registry/exp-021-1.7b-qwen3-dv7/selection.json'))['winner'])" 2>/dev/null || true)"
rm -rf "training/checkpoints/exp-021-1.7b-qwen3-dv7/checkpoint-"*
if [ -n "$winner" ]; then
  for gguf in evaluation/registry/exp-021-1.7b-qwen3-dv7/gguf/checkpoint-*.gguf; do
    [ -f "$gguf" ] || continue
    case "$(basename "$gguf")" in "$winner.gguf") ;; *) rm -f "$gguf";; esac
  done
fi
note "EXP-021 COMPLETE"
{
  echo "=== exp-021 (Qwen3-1.7B, dv7 containers) ==="
  grep -E "oracle match|capability probes" evaluation/registry/exp-021-1.7b-qwen3-dv7/series.log | tail -2
  echo "=== books ==="
  python3 -c "import json; m=json.load(open('evaluation/registry/exp-021-1.7b-qwen3-dv7/metrics.json')); books=sum(v['classes'].get('answer_match',0) for k,v in m['byBook'].items() if k!='procedural-arithmetic'); print(f'books {books}/225')"
  echo "=== container families on the holdout ==="
  python3 -c "
import json, glob
hits = {}
for f in glob.glob('evaluation/registry/exp-021-1.7b-qwen3-dv7/items/holdout.jsonl'):
    for line in open(f):
        r = json.loads(line)
        fam = r.get('family') or r.get('template') or '?'
        if 'container' in str(fam).lower() or 'stage' in str(fam).lower():
            hits[fam] = hits.get(fam, 0) + (1 if r.get('class') == 'answer_match' else 0)
print(hits)"
} > evaluation/registry/exp021-final.txt 2>&1
