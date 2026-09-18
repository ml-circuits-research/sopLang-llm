# 339 — Propagation of effects through a network

Problem world. In a simple-circuit model, a battery, wires, and a bulb must form a closed path for the bulb to light. A break anywhere along the path opens the circuit. Some materials conduct and can bridge a gap; others are insulators. We do not use details about voltage or current; every conclusion follows only from the idea of a continuous path.

Case data. The network of dependencies has the arrows: battery connected → source available; path continuous → circuit closed; circuit closed → the bulb can receive energy; bulb connected and circuit closed → bulb lit. We change “battery connected”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
