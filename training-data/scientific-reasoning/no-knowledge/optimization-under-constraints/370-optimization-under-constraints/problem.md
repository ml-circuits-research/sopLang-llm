# 370 — Optimization under constraints

Problem world. In the teaching model, foods can provide energy and substances needed to build and operate the body. A balanced meal is not decided by a single food but by the combination and amount. For this problem, each option has explicitly stated properties; no real food values need to be memorized. We track three requirements at the same time: enough energy, a source of protein, and a source of fiber.

Case data. The target is to obtain all of the following conditions: fiber present, protein present. The forbidden effects are: sugar over limit. The options are: add a protein source: cost 2, effects [protein present], undesired effects [none]. add vegetables: cost 1, effects [fiber present], undesired effects [none]. reduce the sweet portion: cost 1, effects [sugar below the limit], undesired effects [none]. add a very sweet drink: cost 1, effects [quick energy], undesired effects [sugar over limit].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
