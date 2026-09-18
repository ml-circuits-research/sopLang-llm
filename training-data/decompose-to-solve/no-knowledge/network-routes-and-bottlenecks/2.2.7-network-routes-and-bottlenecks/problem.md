# 2.2.7 — Network Routes and Bottlenecks

Scenario. For sequencing a small renovation project, three routes can move the same construction tasks. Each route has three sequential links. A: times [6, 11, 14] min, capacities [74, 98, 64]; B: times [12, 12, 12] min, capacities [35, 38, 57]; C: times [17, 12, 12] min, capacities [98, 81, 63]. The required flow is 40 units and total route time must not exceed 47 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
