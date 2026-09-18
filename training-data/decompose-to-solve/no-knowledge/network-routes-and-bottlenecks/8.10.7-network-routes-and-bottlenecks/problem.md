# 8.10.7 — Network Routes and Bottlenecks

Scenario. For diagnosing a service incident, three routes can move the same service components. Each route has three sequential links. A: times [16, 7, 14] min, capacities [85, 40, 90]; B: times [11, 15, 15] min, capacities [82, 93, 55]; C: times [8, 6, 12] min, capacities [84, 91, 43]. The required flow is 40 units and total route time must not exceed 41 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
