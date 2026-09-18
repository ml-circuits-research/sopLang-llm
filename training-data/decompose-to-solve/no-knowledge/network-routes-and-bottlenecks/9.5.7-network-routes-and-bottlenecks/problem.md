# 9.5.7 — Network Routes and Bottlenecks

Scenario. For checking a batch or service process, three routes can move the same samples. Each route has three sequential links. A: times [13, 11, 10] min, capacities [36, 41, 89]; B: times [12, 12, 12] min, capacities [98, 52, 80]; C: times [15, 13, 8] min, capacities [99, 44, 85]. The required flow is 36 units and total route time must not exceed 51 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
