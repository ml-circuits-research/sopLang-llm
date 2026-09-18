# 7.9.7 — Network Routes and Bottlenecks

Scenario. For reconstructing a non-political event from reports, three routes can move the same reports. Each route has three sequential links. A: times [18, 15, 13] min, capacities [60, 47, 72]; B: times [12, 15, 12] min, capacities [47, 88, 50]; C: times [6, 16, 16] min, capacities [53, 76, 89]. The required flow is 53 units and total route time must not exceed 46 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
