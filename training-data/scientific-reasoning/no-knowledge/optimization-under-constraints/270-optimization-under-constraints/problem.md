# 270 — Optimization under constraints

Problem world. In this problem, a habitat provides resources such as water, food, shelter, and a tolerable temperature. An adaptation is a characteristic that helps an organism in a particular environment; the same characteristic is not equally useful in every environment. For animal Z in the model, good survival requires water, food, and shelter at the same time.

Case data. The target is to obtain all of the following conditions: shelter, water available. The forbidden effects are: shelter reduced. The options are: planting shrubs: cost 2, effects [shelter, more shade], undesired effects [none]. restoring the spring: cost 2, effects [water available], undesired effects [none]. maintaining vegetation: cost 1, effects [shelter, food], undesired effects [none]. paving the area: cost 1, effects [easy path], undesired effects [shelter reduced].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
