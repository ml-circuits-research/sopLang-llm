# 284 — Propagation of effects through a network

Problem world. In the simplified model, inhaled air brings oxygen into the lungs; oxygen passes into the blood, and the blood carries it to the cells. Cells produce carbon dioxide, which is carried by the blood back to the lungs and then exhaled. If one transport link is blocked, stages after that link receive less of the transported substance.

Case data. The network of dependencies has the arrows: efficient breathing → oxygen in lungs; oxygen in lungs → oxygen in blood; oxygen in blood → oxygen transported; oxygen transported → oxygen at the cells. We change “efficient breathing”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
