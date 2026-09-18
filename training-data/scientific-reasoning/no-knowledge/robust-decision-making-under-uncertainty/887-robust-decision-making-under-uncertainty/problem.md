# 887 — Robust decision-making under uncertainty

Given knowledge. Fungi and bacteria can decompose organic remains. In the model, active decomposition needs decomposers, enough water, and a suitable temperature; the matter in the remains is transformed and some substances return to the soil. Dead leaves do not disappear instantly; decomposition has stages. Strong drying can slow the activity of many decomposers.

Problem data. The real state is unknown. The following scenarios are still possible: only “there is enough moisture” is faulty, only “the temperature is suitable” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels B and C.
