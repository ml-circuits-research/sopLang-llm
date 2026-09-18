# 440 — Minimum intervention in a system

Problem world. In the model, heat transfers from a warmer body toward a cooler one until the difference becomes smaller. An insulating material slows heat transfer; it does not “make cold” or create energy. For a fair comparison, containers must begin at the same temperature and be observed for the same amount of time.

Case data. The system should be modified as little as possible. The targets are: loss through opening reduced, transfer slowed; forbidden effects: loss additional. Available interventions: adding insulation: cost 2, effects [transfer slowed], undesired effects [none]. close the lid: cost 1, effects [loss through opening reduced], undesired effects [none]. using an identical container: cost 1, effects [comparison fair], undesired effects [none]. open repeatedly: cost 1, effects [check visual], undesired effects [loss additional].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
