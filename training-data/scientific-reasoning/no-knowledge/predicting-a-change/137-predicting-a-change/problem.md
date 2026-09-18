# 137 — Predicting a change

Problem world. In the small meadow described here, grass is eaten by rabbits, and rabbits can be eaten by foxes. If the food available to one group decreases greatly, that group has fewer resources; the effect can then continue along the chain. We will not assume that animal numbers change instantly: we track only the likely direction of the effect after some time.

Case data. Before the change, the system is stable. Now we activate or increase “more grass”. The causal rules are: more grass → more food for rabbits. More food for rabbits → rabbits better fed. Rabbits better fed → more food available for foxes. More food available for foxes → the foxes find food more easily.

Question. Predict the effects that may appear downstream. Separate the direct effect from the indirect effects.
