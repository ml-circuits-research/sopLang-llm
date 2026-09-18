# 354 — Propagation of effects through a network

Problem world. In the model, Earth is approximated as a sphere rotating around its axis. The side facing the Sun is illuminated, while the opposite side is in night. As Earth rotates, a place can move from the illuminated region to the dark region and back again. These problems do not require astronomical distances or real durations; we use only the stated geometric model.

Case data. The network of dependencies has the arrows: the part oriented toward Sun → day; the part opposite the Sun → night; rotation Earth → changing the location’s orientation; changing the location’s orientation → alternation day-night. We change “the part oriented toward Sun”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
