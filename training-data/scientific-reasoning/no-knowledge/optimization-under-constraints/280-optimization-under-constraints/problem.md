# 280 — Optimization under constraints

Problem world. In the simplified model used here, food is broken into smaller pieces in the mouth, reaches the stomach, and then the small intestine, where much of the nutrients pass into the blood. In the large intestine, some water is recovered from the remaining material. The order of the organs matters: a substance cannot reach a later part of the intestine before passing through earlier parts of the route.

Case data. The target is to obtain all of the following conditions: smaller pieces, food reaches the intestine. The forbidden effects are: route incomplete. The options are: chewing more careful: cost 1, effects [smaller pieces], undesired effects [none]. Route free: cost 2, effects [food reaches the intestine], undesired effects [none]. Hydration sufficient: cost 1, effects [water available of the organism], undesired effects [none]. Jumping of a stages: cost 1, effects [time reduced], undesired effects [route incomplete].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
