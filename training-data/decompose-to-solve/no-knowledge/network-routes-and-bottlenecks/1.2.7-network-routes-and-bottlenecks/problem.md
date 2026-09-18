# 1.2.7 — Network Routes and Bottlenecks

Scenario. For a local public-transport journey, three routes can move the same journey legs. Each route has three sequential links. A: times [6, 10, 7] min, capacities [37, 42, 96]; B: times [12, 10, 17] min, capacities [91, 37, 53]; C: times [16, 6, 12] min, capacities [100, 67, 42]. The required flow is 37 units and total route time must not exceed 44 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
