# 2.5.7 — Network Routes and Bottlenecks

Scenario. For running a laboratory workflow, three routes can move the same samples. Each route has three sequential links. A: times [15, 10, 16] min, capacities [100, 79, 98]; B: times [11, 16, 17] min, capacities [71, 58, 100]; C: times [8, 13, 15] min, capacities [59, 91, 74]. The required flow is 57 units and total route time must not exceed 41 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
