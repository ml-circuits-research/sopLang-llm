# 314 — Propagation of effects through a network

Problem world. In the model, heat transfers from a warmer body toward a cooler one until the difference becomes smaller. An insulating material slows heat transfer; it does not “make cold” or create energy. For a fair comparison, containers must begin at the same temperature and be observed for the same amount of time.

Case data. The network of dependencies has the arrows: temperature difference → heat transfer; layer insulator → transfer more slowly; transfer more slowly → temperature keeps better; lid closed → loss through opening reduced. We change “temperature difference”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
