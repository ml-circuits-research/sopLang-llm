# 279 — Propagation of effects through a network

Problem world. In the simplified model used here, food is broken into smaller pieces in the mouth, reaches the stomach, and then the small intestine, where much of the nutrients pass into the blood. In the large intestine, some water is recovered from the remaining material. The order of the organs matters: a substance cannot reach a later part of the intestine before passing through earlier parts of the route.

Case data. The network of dependencies has the arrows: effective chewing → smaller pieces; smaller pieces → food is mixed more easily; food reaches the small intestine → the nutrients can be absorbed; nutrients have been absorbed → the blood can transport them. We change “effective chewing”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
