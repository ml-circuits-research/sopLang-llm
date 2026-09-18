# 274 — Propagation of effects through a network

Problem world. For insect L in this problem, the life cycle has four stages in order: egg, larva, pupa, adult. Only the adult lays eggs, and a larva cannot become an adult without passing through the pupal stage. A temperature in the suitable range may change the rate of development, but it does not change the order of the stages.

Case data. The network of dependencies has the arrows: viable egg → larva appears; larva appears → can reach the pupa stage; reaches the pupa stage → the adult can emerge; adult emerges → new eggs can be laid. We change “egg viable”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
