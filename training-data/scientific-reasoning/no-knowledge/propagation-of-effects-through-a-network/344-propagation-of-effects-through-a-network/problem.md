# 344 — Propagation of effects through a network

Problem world. In the model, air occupies space, water flows through open spaces, and soils differ in how quickly they allow water to pass. Soil with different particles and spaces may retain more or less water; this property is measured in the test rather than guessed. To compare two soils, we pour the same amount of water and wait the same amount of time.

Case data. The network of dependencies has the arrows: larger spaces in the soil → faster drainage; faster drainage → less water retained in test; compaction → spaces free reduced; spaces free reduced → drainage more slow in the model. We change “larger spaces in the soil”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
