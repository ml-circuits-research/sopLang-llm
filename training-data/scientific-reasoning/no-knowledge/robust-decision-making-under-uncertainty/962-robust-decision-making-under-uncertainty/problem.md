# 962 — Robust decision-making under uncertainty

Given knowledge. In the circuit model, the metals used here are conductors, while plastic and rubber are insulators. Current appears only if there is a continuous conducting path between the source terminals; insulation is used to prevent contact with conducting parts. A conductor allows current to pass in the model. An insulator breaks the electrical path.

Problem data. The real state is unknown. The following scenarios are still possible: only “the conducting path is continuous” is faulty, only “the touched parts have been insulated” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A and C.
