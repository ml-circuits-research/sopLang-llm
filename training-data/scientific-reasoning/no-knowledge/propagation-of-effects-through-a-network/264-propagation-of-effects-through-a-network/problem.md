# 264 — Propagation of effects through a network

Problem world. In the small meadow described here, grass is eaten by rabbits, and rabbits can be eaten by foxes. If the food available to one group decreases greatly, that group has fewer resources; the effect can then continue along the chain. We will not assume that animal numbers change instantly: we track only the likely direction of the effect after some time.

Case data. The network of dependencies has the arrows: more grass → more food for rabbits; more food for rabbits → rabbits better fed; rabbits better fed → more food available for foxes; more food available for foxes → the foxes find food more easily. We change “more grass”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
