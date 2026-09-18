# 299 — Propagation of effects through a network

Problem world. Choosing a material depends on the properties required by the object, such as waterproofness, flexibility, transparency, or thermal insulation. No material is “the best” in every situation; it is suitable if it meets the requirements of its use at the same time. In this problem, the properties are stated explicitly and do not need to be guessed from everyday experience.

Case data. The network of dependencies has the arrows: material waterproof → water does not pass through; insulating material → the transfer of heat slows; transparent material → light passes; material flexible → can bend without breaks in test. We change “material waterproof”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
