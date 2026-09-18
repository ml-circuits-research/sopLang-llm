# 6.8.7 — Network Routes and Bottlenecks

Scenario. For planning a multilingual translation workflow, three routes can move the same text segments. Each route has three sequential links. A: times [9, 16, 14] min, capacities [86, 78, 79]; B: times [16, 14, 10] min, capacities [58, 98, 81]; C: times [14, 17, 10] min, capacities [85, 95, 70]. The required flow is 63 units and total route time must not exceed 50 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
