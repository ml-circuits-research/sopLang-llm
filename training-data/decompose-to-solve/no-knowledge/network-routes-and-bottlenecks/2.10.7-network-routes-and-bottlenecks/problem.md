# 2.10.7 — Network Routes and Bottlenecks

Scenario. For planning a staged evacuation exercise, three routes can move the same evacuation groups. Each route has three sequential links. A: times [11, 11, 15] min, capacities [41, 97, 41]; B: times [14, 18, 8] min, capacities [40, 49, 90]; C: times [14, 17, 12] min, capacities [56, 48, 76]. The required flow is 41 units and total route time must not exceed 44 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
