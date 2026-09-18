# 5.6.7 — Network Routes and Bottlenecks

Scenario. For planning an activity near a coast, three routes can move the same coastal observations. Each route has three sequential links. A: times [10, 15, 7] min, capacities [71, 64, 56]; B: times [13, 17, 16] min, capacities [47, 49, 62]; C: times [16, 16, 10] min, capacities [35, 73, 44]. The required flow is 42 units and total route time must not exceed 43 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
