# 1.7.4 — Dependency Chain and Join

Scenario. In following a multi-step administrative procedure, five work packages A–E must be completed. A takes 11 minutes. B (5 min) and C (6 min) can start only after A but may then run in parallel. D (6 min) needs both B and C finished. E (17 min) follows D. A final safety or review buffer of 10 minutes is mandatory, and the completion limit is 44 minutes. The description mentions the total number of documents, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
