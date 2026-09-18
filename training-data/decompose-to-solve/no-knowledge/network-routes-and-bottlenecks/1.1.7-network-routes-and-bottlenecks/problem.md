# 1.1.7 — Network Routes and Bottlenecks

Scenario. For household faults and maintenance observations, three routes can move the same observations. Each route has three sequential links. A: times [8, 6, 18] min, capacities [38, 75, 37]; B: times [14, 8, 8] min, capacities [82, 53, 49]; C: times [14, 14, 15] min, capacities [52, 67, 54]. The required flow is 45 units and total route time must not exceed 47 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
