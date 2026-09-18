# 390 — Minimum intervention in a system

Problem world. In the small meadow described here, grass is eaten by rabbits, and rabbits can be eaten by foxes. If the food available to one group decreases greatly, that group has fewer resources; the effect can then continue along the chain. We will not assume that animal numbers change instantly: we track only the likely direction of the effect after some time.

Case data. The system should be modified as little as possible. The targets are: water available, more food for rabbits; forbidden effects: food reduced. Available interventions: restoration of the grass: cost 2, effects [more food for rabbits], undesired effects [none]. Protecting of the spring: cost 1, effects [water available], undesired effects [none]. Corridor of shelter: cost 2, effects [shelter available], undesired effects [none]. Elimination of all of the plants: cost 1, effects [terrain free], undesired effects [food reduced].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
