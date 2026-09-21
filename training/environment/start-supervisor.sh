#!/usr/bin/env bash
# Start the unattended agent supervisor detached from every session.
#
# Owner directive: the machine is left alone overnight, so nothing here may depend
# on a terminal, an SSH session, or an agent session that is already running.
# The supervisor reads its instructions from overnight-supervisor-prompt.md, writes
# to evaluation/registry/overnight-supervisor.log, and records its own pid so a
# later session can check whether it is still alive.
set -uo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"
mkdir -p evaluation/registry
setsid nohup omp --cwd "$root" --auto-approve @"training/environment/overnight-supervisor-prompt.md" \
  >> evaluation/registry/overnight-supervisor.log 2>&1 < /dev/null &
pid=$!
echo "$pid" > evaluation/registry/overnight-supervisor.pid
sleep 20
if kill -0 "$pid" 2>/dev/null; then
  echo "start-supervisor: agent supervisor running detached (pid $pid, session $(ps -o sid= -p "$pid" 2>/dev/null | tr -d ' '))"
else
  echo "start-supervisor: the supervisor exited at once; see evaluation/registry/overnight-supervisor.log"
fi
