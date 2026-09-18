# 5.6.4 — Dependency Chain and Join

Scenario. In planning an activity near a coast, five work packages A–E must be completed. A takes 9 minutes. B (11 min) and C (14 min) can start only after A but may then run in parallel. D (5 min) needs both B and C finished. E (15 min) follows D. A final safety or review buffer of 3 minutes is mandatory, and the completion limit is 50 minutes. The description mentions the total number of coastal observations, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
