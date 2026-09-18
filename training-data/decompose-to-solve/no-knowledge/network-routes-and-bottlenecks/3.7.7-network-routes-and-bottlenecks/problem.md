# 3.7.7 — Network Routes and Bottlenecks

Scenario. For interpreting population and area data, three routes can move the same population groups. Each route has three sequential links. A: times [14, 6, 14] min, capacities [70, 52, 65]; B: times [10, 10, 6] min, capacities [95, 44, 92]; C: times [12, 12, 12] min, capacities [86, 74, 56]. The required flow is 44 units and total route time must not exceed 42 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
