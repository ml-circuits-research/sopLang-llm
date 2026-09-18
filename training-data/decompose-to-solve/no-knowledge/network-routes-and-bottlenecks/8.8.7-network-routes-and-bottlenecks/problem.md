# 8.8.7 — Network Routes and Bottlenecks

Scenario. For reasoning about encryption, signatures, and key handling, three routes can move the same messages. Each route has three sequential links. A: times [17, 11, 11] min, capacities [73, 60, 56]; B: times [8, 15, 8] min, capacities [79, 54, 35]; C: times [11, 12, 17] min, capacities [54, 38, 95]. The required flow is 35 units and total route time must not exceed 50 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
