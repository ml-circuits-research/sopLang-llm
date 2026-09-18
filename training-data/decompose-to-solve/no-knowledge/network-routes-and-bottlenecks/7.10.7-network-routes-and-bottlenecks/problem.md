# 7.10.7 — Network Routes and Bottlenecks

Scenario. For combining results from several experiments, three routes can move the same experimental results. Each route has three sequential links. A: times [11, 11, 6] min, capacities [71, 59, 84]; B: times [15, 6, 9] min, capacities [91, 93, 63]; C: times [12, 11, 16] min, capacities [42, 47, 69]. The required flow is 59 units and total route time must not exceed 44 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
