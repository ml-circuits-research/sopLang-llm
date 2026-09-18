# 714 — Paths in a network with constraints

Given knowledge. In the circuit model, the metals used here are conductors, while plastic and rubber are insulators. Current appears only if there is a continuous conducting path between the source terminals; insulation is used to prevent contact with conducting parts. A conductor allows current to pass in the model. An insulator breaks the electrical path.

Problem data. The network has bidirectional edges with the following costs: the positive terminal–the switch:1; the switch–the insulated handle:2; the positive terminal–the bulb:2; the bulb–the negative terminal:1; the negative terminal–the insulated handle:1; the switch–the negative terminal:2. The bulb–the negative terminal link is closed. The starting point is “the positive terminal”, the destination is “the insulated handle”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
