# 152 — Predicting a change

Problem world. In the simplified model used here, food is broken into smaller pieces in the mouth, reaches the stomach, and then the small intestine, where much of the nutrients pass into the blood. In the large intestine, some water is recovered from the remaining material. The order of the organs matters: a substance cannot reach a later part of the intestine before passing through earlier parts of the route.

Case data. Before the change, the system is stable. Now “effective chewing” increases/is activated. The causal rules are: effective chewing → smaller pieces. Smaller pieces → food is mixed more easily. Food reaches the small intestine → the nutrients can be absorbed. Nutrients have been absorbed → the blood can transport them.

Question. Predict the effects that may appear downstream. Separate the direct effect from the indirect effects.
