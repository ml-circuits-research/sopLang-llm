# 6.2.7 — Network Routes and Bottlenecks

Scenario. For analyzing exchange along a historical trade network, three routes can move the same trade links. Each route has three sequential links. A: times [18, 8, 17] min, capacities [61, 59, 37]; B: times [11, 6, 7] min, capacities [75, 66, 64]; C: times [6, 9, 8] min, capacities [90, 35, 41]. The required flow is 46 units and total route time must not exceed 55 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
