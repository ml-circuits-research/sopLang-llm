# 4.8.7 — Network Routes and Bottlenecks

Scenario. For planning an introductory astronomy observation, three routes can move the same observations. Each route has three sequential links. A: times [8, 8, 6] min, capacities [57, 93, 72]; B: times [18, 6, 18] min, capacities [86, 83, 36]; C: times [9, 14, 15] min, capacities [37, 62, 42]. The required flow is 57 units and total route time must not exceed 51 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
