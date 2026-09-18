# 10.10.4 — Dependency Chain and Join

Scenario. In coordinating a conference and publication workflow, five work packages A–E must be completed. A takes 11 minutes. B (16 min) and C (11 min) can start only after A but may then run in parallel. D (15 min) needs both B and C finished. E (17 min) follows D. A final safety or review buffer of 5 minutes is mandatory, and the completion limit is 72 minutes. The description mentions the total number of submissions, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
