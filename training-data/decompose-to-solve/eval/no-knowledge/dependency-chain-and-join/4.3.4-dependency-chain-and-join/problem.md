# 4.3.4 — Dependency Chain and Join

Scenario. In planning a low-voltage electrical load, five work packages A–E must be completed. A takes 9 minutes. B (12 min) and C (15 min) can start only after A but may then run in parallel. D (5 min) needs both B and C finished. E (6 min) follows D. A final safety or review buffer of 7 minutes is mandatory, and the completion limit is 36 minutes. The description mentions the total number of electrical loads, but the task durations already incorporate that workload, so recounting them would double-count input.

Main question. What is the earliest safe completion time, and does the plan meet the limit? Best decomposition (5 subproblems).
