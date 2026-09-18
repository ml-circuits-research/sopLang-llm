# 10.10.7 — Network Routes and Bottlenecks

Scenario. For coordinating a conference and publication workflow, three routes can move the same submissions. Each route has three sequential links. A: times [14, 17, 16] min, capacities [86, 76, 45]; B: times [8, 14, 15] min, capacities [42, 89, 83]; C: times [15, 10, 6] min, capacities [90, 41, 75]. The required flow is 41 units and total route time must not exceed 36 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
