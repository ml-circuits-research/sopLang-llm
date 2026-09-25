#!/usr/bin/env bash
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"
note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> evaluation/registry/overnight-pipeline.log; }
source "$(dirname "${BASH_SOURCE[0]}")/lib-watch.sh"
wait_chain exp-019-1.7b-qwen3-dv5
winner="$(python3 -c "import json; print(json.load(open('evaluation/registry/exp-019-1.7b-qwen3-dv5/selection.json'))['winner'])" 2>/dev/null || true)"
rm -rf "training/checkpoints/exp-019-1.7b-qwen3-dv5/checkpoint-"*
if [ -n "$winner" ]; then
  for gguf in evaluation/registry/exp-019-1.7b-qwen3-dv5/gguf/checkpoint-*.gguf; do
    [ -f "$gguf" ] || continue
    case "$(basename "$gguf")" in "$winner.gguf") ;; *) rm -f "$gguf";; esac
  done
fi
note "EXP-019 COMPLETE"
{
  echo "=== exp-019 (Qwen3-1.7B, dv5 probe-clean) ==="
  grep -E "oracle match|capability probes" evaluation/registry/exp-019-1.7b-qwen3-dv5/series.log | tail -2
  echo "=== vs exp-017 (dv3, same base) ==="
  python3 -c "
import json
a=json.load(open('evaluation/registry/exp-017-qwen3-17b/metrics.json'))['classes']
b=json.load(open('evaluation/registry/exp-019-1.7b-qwen3-dv5/metrics.json'))['classes']
print('exp-017:', a['answer_match'], 'of', a['answer_match']+a['answer_mismatch']+a['execution_error'])
print('exp-019:', b['answer_match'], 'of', b['answer_match']+b['answer_mismatch']+b['execution_error'])"
  echo "=== books ==="
  python3 -c "import json; m=json.load(open('evaluation/registry/exp-019-1.7b-qwen3-dv5/metrics.json')); books=sum(v['classes'].get('answer_match',0) for k,v in m['byBook'].items() if k!='procedural-arithmetic'); print(f'books {books}/225')"
} > evaluation/registry/exp019-final.txt 2>&1
