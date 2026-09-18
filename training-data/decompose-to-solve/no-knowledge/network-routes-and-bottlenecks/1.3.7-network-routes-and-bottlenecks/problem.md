# 1.3.7 — Network Routes and Bottlenecks

Scenario. For preparing food for a group, three routes can move the same portions. Each route has three sequential links. A: times [14, 7, 16] min, capacities [92, 38, 47]; B: times [14, 12, 11] min, capacities [46, 90, 45]; C: times [14, 8, 8] min, capacities [50, 81, 88]. The required flow is 50 units and total route time must not exceed 55 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
