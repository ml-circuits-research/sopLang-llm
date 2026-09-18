# 3.2.4 — Dependency Chain and Join

Scenario. In planning water use and storage, five work packages A–E must be completed. A takes 10 minutes. B (14 min) and C (11 min) can start only after A but may then run in parallel. D (15 min) needs both B and C finished. E (9 min) follows D. A final safety or review buffer of 9 minutes is mandatory, and the completion limit is 65 minutes. The description mentions the total number of litres of water, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
