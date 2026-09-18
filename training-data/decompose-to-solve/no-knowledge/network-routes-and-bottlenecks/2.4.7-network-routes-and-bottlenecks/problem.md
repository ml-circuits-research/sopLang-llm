# 2.4.7 — Network Routes and Bottlenecks

Scenario. For installing a museum exhibition, three routes can move the same exhibition components. Each route has three sequential links. A: times [8, 12, 12] min, capacities [45, 69, 98]; B: times [12, 16, 10] min, capacities [38, 93, 89]; C: times [14, 17, 11] min, capacities [89, 63, 62]. The required flow is 45 units and total route time must not exceed 37 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
