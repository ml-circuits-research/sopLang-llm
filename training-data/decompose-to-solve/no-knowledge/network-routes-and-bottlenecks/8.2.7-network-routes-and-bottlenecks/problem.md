# 8.2.7 — Network Routes and Bottlenecks

Scenario. For designing a basic authentication flow, three routes can move the same authentication steps. Each route has three sequential links. A: times [11, 8, 12] min, capacities [90, 80, 76]; B: times [14, 7, 15] min, capacities [41, 82, 37]; C: times [15, 17, 10] min, capacities [89, 65, 43]. The required flow is 63 units and total route time must not exceed 46 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
