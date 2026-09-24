#!/usr/bin/env bash
# The standing guard for a working session. Every CHECK_INTERVAL it runs the
# health check and writes one line to the sentinel log. Silent while healthy;
# when an alarm marker exists, the disk is below WARN_FREE_GIB, or the check
# output is CRITICAL, it prints the full report and exits non-zero so the
# supervising agent is woken. Usage: bash session-sentinel.sh
set -uo pipefail
PROJECT_ROOT="${PROJECT_ROOT:-$(pwd)}"
JOBS_DIR="${JOBS_DIR:-$PROJECT_ROOT/.jobs}"
RESULTS_DIR="${RESULTS_DIR:-$PROJECT_ROOT/.results}"
HEALTH_COMMAND="${HEALTH_COMMAND:-}"
INTERVAL="${SENTINEL_INTERVAL:-1800}"
LOG="${SENTINEL_LOG:-$PROJECT_ROOT/.session-sentinel.log}"
WARN_FREE_GIB="${WARN_FREE_GIB:-40}"
note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> "$LOG"; }
note "session sentinel started (interval ${INTERVAL}s, warn ${WARN_FREE_GIB} GiB)"

problems=0
check_once() {
  if [ -n "$HEALTH_COMMAND" ]; then
    report="$(bash -c "$HEALTH_COMMAND" 2>&1 || true)"
  else
    report="$(bash "$(dirname "${BASH_SOURCE[0]}")/health-check.sh" 2>&1 || true)"
  fi
  free_gib="$(df -k "$PROJECT_ROOT" | awk 'NR==2 {print $4}')"
  free_gib=$(( free_gib / 1024 / 1024 ))
  alarm=""
  [ -n "$(ls "$JOBS_DIR"/*/STALL-ALARM.txt "$RESULTS_DIR"/*/CHAIN-ALARM.txt 2>/dev/null || true)" ] && alarm="alarm-marker"
  problems=0
  if [ -n "$alarm" ]; then problems=1; fi
  if [ "$free_gib" -lt "$WARN_FREE_GIB" ]; then problems=1; fi
  if printf '%s' "$report" | grep -q "CRITICAL"; then problems=1; fi
  if [ "$problems" -eq 0 ]; then
    note "check OK: disk ${free_gib} GiB"
  else
    note "PROBLEMS: ${alarm:-none}, disk ${free_gib} GiB"
    printf '%s\n' "$report"
    exit 1
  fi
}

while :; do
  check_once
  sleep "$INTERVAL"
done
