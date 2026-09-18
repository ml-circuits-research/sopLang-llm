# 315 — Optimization under constraints

Problem world. In the model, heat transfers from a warmer body toward a cooler one until the difference becomes smaller. An insulating material slows heat transfer; it does not “make cold” or create energy. For a fair comparison, containers must begin at the same temperature and be observed for the same amount of time.

Case data. The target is to obtain all of the following conditions: loss through opening reduced, transfer slowed. The forbidden effects are: loss additional. The options are: adding insulation: cost 2, effects [transfer slowed], undesired effects [none]. close the lid: cost 1, effects [loss through opening reduced], undesired effects [none]. using an identical container: cost 1, effects [comparison fair], undesired effects [none]. open repeatedly: cost 1, effects [check visual], undesired effects [loss additional].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
