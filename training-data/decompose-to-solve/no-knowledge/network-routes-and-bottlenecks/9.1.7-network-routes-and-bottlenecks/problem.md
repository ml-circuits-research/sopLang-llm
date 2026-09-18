# 9.1.7 — Network Routes and Bottlenecks

Scenario. For allocating work across a small team, three routes can move the same work packages. Each route has three sequential links. A: times [10, 8, 12] min, capacities [62, 84, 49]; B: times [11, 18, 8] min, capacities [49, 95, 43]; C: times [18, 11, 17] min, capacities [80, 48, 96]. The required flow is 49 units and total route time must not exceed 54 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
