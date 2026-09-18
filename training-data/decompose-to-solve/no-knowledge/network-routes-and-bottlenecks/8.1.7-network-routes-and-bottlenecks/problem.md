# 8.1.7 — Network Routes and Bottlenecks

Scenario. For diagnosing or planning a small computer network, three routes can move the same network links. Each route has three sequential links. A: times [16, 12, 17] min, capacities [35, 36, 49]; B: times [10, 17, 13] min, capacities [85, 75, 73]; C: times [11, 18, 15] min, capacities [57, 85, 75]. The required flow is 54 units and total route time must not exceed 51 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
