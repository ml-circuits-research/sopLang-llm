#!/usr/bin/env bash
# The exp-018 tail: its chain, the prune, and the delivery summary.
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"
note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> evaluation/registry/overnight-pipeline.log; }
source "$(dirname "${BASH_SOURCE[0]}")/lib-watch.sh"
wait_chain exp-018-1.7b-qwen3-dv4
winner="$(python3 -c "import json; print(json.load(open('evaluation/registry/exp-018-1.7b-qwen3-dv4/selection.json'))['winner'])" 2>/dev/null || true)"
rm -rf "training/checkpoints/exp-018-1.7b-qwen3-dv4/checkpoint-"*
if [ -n "$winner" ]; then
  for gguf in evaluation/registry/exp-018-1.7b-qwen3-dv4/gguf/checkpoint-*.gguf; do
    [ -f "$gguf" ] || continue
    case "$(basename "$gguf")" in "$winner.gguf") ;; *) rm -f "$gguf";; esac
  done
fi
note "EXP-018 COMPLETE"
{
  echo "=== exp-018 (Qwen3-1.7B, dv4 scheduling) ==="
  grep -E "oracle match|capability probes|parse validity" evaluation/registry/exp-018-1.7b-qwen3-dv4/series.log | tail -3
  echo "=== books ==="
  python3 -c "import json; m=json.load(open('evaluation/registry/exp-018-1.7b-qwen3-dv4/metrics.json')); books=sum(v['classes'].get('answer_match',0) for k,v in m['byBook'].items() if k!='procedural-arithmetic'); print(f'books {books}/225')"
  echo "=== vs exp-017 (dv3, aceeasi baza) ==="
  python3 -c "
import json
a=json.load(open('evaluation/registry/exp-017-qwen3-17b/metrics.json'))['classes']
b=json.load(open('evaluation/registry/exp-018-1.7b-qwen3-dv4/metrics.json'))['classes']
print('exp-017:', a['answer_match'], '/', a['answer_match']+a['answer_mismatch']+a['execution_error'])
print('exp-018:', b['answer_match'], '/', b['answer_match']+b['answer_mismatch']+b['execution_error'])"
} > evaluation/registry/exp018-final.txt 2>&1
