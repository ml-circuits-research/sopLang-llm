# 495 — Minimum intervention in a system

Problem world. In the teaching model, foods can provide energy and substances needed to build and operate the body. A balanced meal is not decided by a single food but by the combination and amount. For this problem, each option has explicitly stated properties; no real food values need to be memorized. We track three requirements at the same time: enough energy, a source of protein, and a source of fiber.

Case data. The system should be modified as little as possible. The targets are: fiber present, protein present; forbidden effects: sugar over limit. Available interventions: add a protein source: cost 2, effects [protein present], undesired effects [none]. add vegetables: cost 1, effects [fiber present], undesired effects [none]. reduce the sweet portion: cost 1, effects [sugar below the limit], undesired effects [none]. add a very sweet drink: cost 1, effects [quick energy], undesired effects [sugar over limit].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
