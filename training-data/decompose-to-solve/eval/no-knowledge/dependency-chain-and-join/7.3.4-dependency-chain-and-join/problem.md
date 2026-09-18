# 7.3.4 — Dependency Chain and Join

Scenario. In interpreting a public survey, five work packages A–E must be completed. A takes 13 minutes. B (14 min) and C (17 min) can start only after A but may then run in parallel. D (9 min) needs both B and C finished. E (8 min) follows D. A final safety or review buffer of 6 minutes is mandatory, and the completion limit is 61 minutes. The description mentions the total number of responses, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
