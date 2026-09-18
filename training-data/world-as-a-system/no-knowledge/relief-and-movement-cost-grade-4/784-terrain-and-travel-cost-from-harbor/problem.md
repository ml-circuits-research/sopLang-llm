# 784 — Terrain and travel cost from Harbor

Knowledge context. Equal-looking distances can require different effort because terrain differs. A simple cost model makes that effect explicit.

Given facts. Terrain energy costs per segment: {'plain': 1, 'forest': 2, 'hill': 3, 'marsh': 4}. Three routes from Harbor to Kite: R1=['plain', 'hill', 'plain']; R2=['plain', 'forest', 'plain', 'plain']; R3=['plain', 'marsh']. The traveler can spend at most 11 energy units.

Rules. The energy of a route is the sum of its terrain costs. A route above the energy limit is infeasible. Among feasible routes, minimize energy.

Task. Which route is feasible and uses the least energy?
