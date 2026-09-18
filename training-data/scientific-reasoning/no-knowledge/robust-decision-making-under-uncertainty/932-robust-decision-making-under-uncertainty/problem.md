# 932 — Robust decision-making under uncertainty

Given knowledge. An object remains stable in the model if the projection of its center of mass stays above its base of support. A wider base or moving mass inward can increase stability. In the model, the center of mass is the point at which we can treat mass as concentrated for balance analysis. Raising mass higher can make the system easier to tip.

Problem data. The real state is unknown. The following scenarios are still possible: only “the center of mass is above the base” is faulty, only “the base of support does not slip” is faulty, only “the load is secured” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A, B, and C.
