# 405 — Minimum intervention in a system

Problem world. In the simplified model used here, food is broken into smaller pieces in the mouth, reaches the stomach, and then the small intestine, where much of the nutrients pass into the blood. In the large intestine, some water is recovered from the remaining material. The order of the organs matters: a substance cannot reach a later part of the intestine before passing through earlier parts of the route.

Case data. The system should be modified as little as possible. The targets are: smaller pieces, food reaches the intestine; forbidden effects: route incomplete. Available interventions: chewing more careful: cost 1, effects [smaller pieces], undesired effects [none]. Route free: cost 2, effects [food reaches the intestine], undesired effects [none]. Hydration sufficient: cost 1, effects [water available of the organism], undesired effects [none]. Jumping of a stages: cost 1, effects [time reduced], undesired effects [route incomplete].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
