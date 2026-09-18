# 380 — Minimum intervention in a system

Problem world. For the imaginary bean species F in this problem, a seed begins germination only if it has water, air, and a suitable temperature. Light is not required for the first step of germination, but it becomes important after the green shoot appears. In our model, if any required condition is missing, germination stops at that point.

Case data. The system should be modified as little as possible. The targets are: water available, temperature suitable; forbidden effects: air blocked. Available interventions: watering: cost 1, effects [water available, the seed becomes hydrated], undesired effects [none]. Ventilation of the soil: cost 1, effects [air available], undesired effects [none]. Moving to a warmer place: cost 2, effects [temperature suitable], undesired effects [none]. Airtight covering: cost 1, effects [keeps moisture], undesired effects [air blocked].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
