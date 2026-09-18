# 1.6.7 — Network Routes and Bottlenecks

Scenario. For organizing a small community event, three routes can move the same event tasks. Each route has three sequential links. A: times [14, 11, 10] min, capacities [36, 56, 99]; B: times [10, 13, 7] min, capacities [54, 48, 93]; C: times [18, 16, 15] min, capacities [88, 82, 83]. The required flow is 42 units and total route time must not exceed 40 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
