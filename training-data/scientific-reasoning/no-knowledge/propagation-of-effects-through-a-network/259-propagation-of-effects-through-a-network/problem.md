# 259 — Propagation of effects through a network

Problem world. In this model, the root absorbs water from the soil, the stem transports it toward the leaves, and the leaves use water, carbon dioxide, and light to make nutrients. If the water pathway through the stem is interrupted, the leaves may receive too little water even when the soil is moist. We will treat a healthy leaf as needing both transported water and light.

Case data. The network of dependencies has the arrows: moist soil → the root can absorb water; the root can absorb water → water enters the stem; water enters the stem → water reaches the leaves; water reaches the leaves → the leaves remain hydrated. We change “moist soil”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
