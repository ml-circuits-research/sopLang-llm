#!/usr/bin/env bash
# One holdout run of the checkpoint a selection chose (training/PLAN.md T6).
#
# Reads `evaluation/registry/<experiment>/selection.json` for the winning
# checkpoint of a selection run, serves its F16 GGUF (already converted by
# `evaluation/select-checkpoint.mjs`) on a local port, runs the D9 evaluation
# loop over the holdout slice, and stops the server again. The per-item records,
# metrics, report, and run manifest land in the same registry folder as the
# selection, so one folder carries the whole T6/T7 evidence of an experiment.
#
# Usage:
#   bash evaluation/run-holdout.sh <experiment-id> [--concurrency N] [--port N]
#
# The holdout slice is the 225 `training-data/<book>/eval/` rows that no run may
# train on; it is resolved by the evaluation loop itself (`--slice holdout`).

set -uo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ "$#" -lt 1 ]; then
  echo "usage: run-holdout.sh <experiment-id> [--concurrency N] [--port N]" >&2
  exit 2
fi
experiment="$1"
shift

concurrency=4
port=8080
while [ "$#" -gt 0 ]; do
  case "$1" in
    --concurrency) concurrency="$2"; shift 2 ;;
    --port) port="$2"; shift 2 ;;
    *) echo "run-holdout: unknown argument: $1" >&2; exit 2 ;;
  esac
done

registry="$repository_root/evaluation/registry/$experiment"
selection="$registry/selection.json"
if [ ! -f "$selection" ]; then
  echo "run-holdout: $selection does not exist; run evaluation/select-checkpoint.mjs first" >&2
  exit 2
fi

gguf="$(python3 -c '
import json, sys
document = json.load(open(sys.argv[1], encoding="utf-8"))
row = next(entry for entry in document["rows"] if entry["checkpoint"] == document["winner"])
print(row["gguf"])
' "$selection")"
if [ ! -f "$gguf" ]; then
  echo "run-holdout: the winning artifact $gguf does not exist" >&2
  exit 2
fi

server="$repository_root/tools/llamacpp/build/bin/llama-server"
echo "run-holdout: $experiment winner $(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["winner"])' "$selection"), artifact $gguf"
"$server" -m "$gguf" --port "$port" --ctx-size 16384 --n-gpu-layers 99 --jinja --parallel 4 \
  --alias student > "$registry/holdout-server.log" 2>&1 &
server_pid=$!
# Stop the server on every exit path, including the readiness failure below: a
# server left running holds the port and the next run scores its model instead
# of its own (the exp-009 selection failure of 2026-09-22).
cleanup() { kill "$server_pid" 2>/dev/null; }
trap cleanup EXIT INT TERM

# Readiness means *this* model answers, not merely that the port is occupied. A
# leftover server of an earlier run would pass a /health probe and every item
# would then be scored by the wrong artifact.
ready=no
for _ in $(seq 1 120); do
  if ! kill -0 "$server_pid" 2>/dev/null; then
    echo "run-holdout: the server for $gguf exited before it was ready; see $registry/holdout-server.log" >&2
    exit 1
  fi
  if curl -sf "http://127.0.0.1:$port/v1/models" 2>/dev/null | grep -q '"student"'; then ready=yes; break; fi
  sleep 1
done
if [ "$ready" != yes ]; then
  echo "run-holdout: llama-server on port $port is not serving this artifact after 120s (its log is $registry/holdout-server.log; another process may hold the port)" >&2
  exit 1
fi

node "$repository_root/evaluation/run-eval.mjs" --experiment "$experiment" --slice holdout \
  --gguf "${gguf#"$repository_root"/}" --base "http://127.0.0.1:$port" --concurrency "$concurrency" --probes
