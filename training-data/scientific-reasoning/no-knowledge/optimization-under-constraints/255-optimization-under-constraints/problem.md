# 255 — Optimization under constraints

Problem world. For the imaginary bean species F in this problem, a seed begins germination only if it has water, air, and a suitable temperature. Light is not required for the first step of germination, but it becomes important after the green shoot appears. In our model, if any required condition is missing, germination stops at that point.

Case data. The target is to obtain all of the following conditions: water available, temperature suitable. The forbidden effects are: air blocked. The options are: watering: cost 1, effects [water available, the seed becomes hydrated], undesired effects [none]. Ventilation of the soil: cost 1, effects [air available], undesired effects [none]. Moving to a warmer place: cost 2, effects [temperature suitable], undesired effects [none]. Airtight covering: cost 1, effects [keeps moisture], undesired effects [air blocked].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
