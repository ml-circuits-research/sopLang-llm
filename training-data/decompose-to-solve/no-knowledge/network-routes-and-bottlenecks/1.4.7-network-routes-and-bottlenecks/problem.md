# 1.4.7 — Network Routes and Bottlenecks

Scenario. For coordinating a day of appointments and tasks, three routes can move the same scheduled tasks. Each route has three sequential links. A: times [6, 11, 8] min, capacities [70, 72, 50]; B: times [15, 16, 13] min, capacities [47, 46, 73]; C: times [13, 14, 11] min, capacities [46, 49, 52]. The required flow is 50 units and total route time must not exceed 48 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
