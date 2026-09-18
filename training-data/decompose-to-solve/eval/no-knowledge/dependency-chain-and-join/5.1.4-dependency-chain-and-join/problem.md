# 5.1.4 — Dependency Chain and Join

Scenario. In using a map to plan a route or field survey, five work packages A–E must be completed. A takes 5 minutes. B (13 min) and C (5 min) can start only after A but may then run in parallel. D (18 min) needs both B and C finished. E (12 min) follows D. A final safety or review buffer of 4 minutes is mandatory, and the completion limit is 49 minutes. The description mentions the total number of map segments, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
