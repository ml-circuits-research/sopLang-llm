# 3.10.7 — Network Routes and Bottlenecks

Scenario. For estimating material and recycling flows, three routes can move the same waste units. Each route has three sequential links. A: times [18, 9, 7] min, capacities [43, 39, 35]; B: times [9, 13, 9] min, capacities [48, 95, 35]; C: times [14, 10, 18] min, capacities [72, 67, 64]. The required flow is 35 units and total route time must not exceed 37 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
