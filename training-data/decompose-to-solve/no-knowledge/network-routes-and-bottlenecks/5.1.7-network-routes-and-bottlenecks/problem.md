# 5.1.7 — Network Routes and Bottlenecks

Scenario. For using a map to plan a route or field survey, three routes can move the same map segments. Each route has three sequential links. A: times [8, 14, 15] min, capacities [95, 76, 91]; B: times [17, 15, 10] min, capacities [79, 35, 54]; C: times [10, 17, 17] min, capacities [75, 80, 35]. The required flow is 76 units and total route time must not exceed 52 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
