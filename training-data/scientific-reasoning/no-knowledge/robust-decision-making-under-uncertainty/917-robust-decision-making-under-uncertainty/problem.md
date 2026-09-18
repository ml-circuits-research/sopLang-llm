# 917 — Robust decision-making under uncertainty

Given knowledge. Microorganisms can multiply on food when they find suitable conditions. In the model, cooling slows multiplication, drying reduces available water, and a clean container reduces initial contamination; none of these measures means that a food becomes sterile. Heat and moisture can speed some biological processes. “Cold” means slowing in the model, not absolute stopping.

Problem data. The real state is unknown. The following scenarios are still possible: only “temperature is low” is faulty, only “available water is reduced” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A and B.
