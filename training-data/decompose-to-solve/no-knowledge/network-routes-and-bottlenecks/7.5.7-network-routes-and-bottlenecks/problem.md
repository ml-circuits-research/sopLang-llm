# 7.5.7 — Network Routes and Bottlenecks

Scenario. For reasoning about a probabilistic decision, three routes can move the same cases. Each route has three sequential links. A: times [16, 10, 10] min, capacities [92, 73, 53]; B: times [14, 16, 10] min, capacities [48, 91, 56]; C: times [10, 12, 12] min, capacities [43, 88, 82]. The required flow is 49 units and total route time must not exceed 53 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
