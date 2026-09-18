# 395 — Minimum intervention in a system

Problem world. In this problem, a habitat provides resources such as water, food, shelter, and a tolerable temperature. An adaptation is a characteristic that helps an organism in a particular environment; the same characteristic is not equally useful in every environment. For animal Z in the model, good survival requires water, food, and shelter at the same time.

Case data. The system should be modified as little as possible. The targets are: shelter, water available; forbidden effects: shelter reduced. Available interventions: planting shrubs: cost 2, effects [shelter, more shade], undesired effects [none]. restoring the spring: cost 2, effects [water available], undesired effects [none]. maintaining vegetation: cost 1, effects [shelter, food], undesired effects [none]. paving the area: cost 1, effects [easy path], undesired effects [shelter reduced].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
