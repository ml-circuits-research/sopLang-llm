# 8.9.7 — Network Routes and Bottlenecks

Scenario. For evaluating a small AI-assisted workflow, three routes can move the same test cases. Each route has three sequential links. A: times [8, 12, 18] min, capacities [63, 47, 74]; B: times [10, 7, 15] min, capacities [87, 37, 49]; C: times [17, 9, 10] min, capacities [76, 38, 62]. The required flow is 37 units and total route time must not exceed 48 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
