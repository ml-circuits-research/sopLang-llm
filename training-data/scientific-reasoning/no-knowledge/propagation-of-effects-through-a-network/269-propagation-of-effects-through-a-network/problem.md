# 269 — Propagation of effects through a network

Problem world. In this problem, a habitat provides resources such as water, food, shelter, and a tolerable temperature. An adaptation is a characteristic that helps an organism in a particular environment; the same characteristic is not equally useful in every environment. For animal Z in the model, good survival requires water, food, and shelter at the same time.

Case data. The network of dependencies has the arrows: more shade → lower local temperature; lower local temperature → loss of water smaller; loss of water smaller → the animal remains active more; the animal remains active more → can search more food. We change “more shade”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
