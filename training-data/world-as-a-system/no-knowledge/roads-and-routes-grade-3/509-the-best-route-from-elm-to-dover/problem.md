# 509 — The best route from Elm to Dover

Knowledge context. A road map can be modeled as a graph. The best route depends on the stated criterion, not on how short it looks on paper.

Given facts. Elm–Meadow–Dover has segment costs [8, 9] (total 17); Elm–Iris–Harbor–Dover has segment costs [7, 5, 5] (total 17); Elm–Yarrow–Dover has segment costs [11, 6] (total 17). The road Elm–Iris is closed.

Rules. A route is feasible only if all of its roads are open. The cost of a route is the sum of its segment costs. Choose the feasible route with the smallest total.

Task. Which route should a traveler use from Elm to Dover, and why?
