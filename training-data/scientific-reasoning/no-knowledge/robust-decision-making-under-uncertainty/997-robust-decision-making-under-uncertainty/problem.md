# 997 — Robust decision-making under uncertainty

Given knowledge. In the kitchen model, heating transfers energy, dissolving forms a homogeneous mixture only for certain substances and quantities, and clean utensils reduce contamination. Experimental recipes can be compared only when quantities and times are measured in the same way. A dissolved substance has not disappeared; it is distributed through the solvent. Stirring can speed dissolving without changing the maximum amount allowed by the model.

Problem data. The real state is unknown. The following scenarios are still possible: only “the quantities are measured in the same way” is faulty, only “temperature is controlled” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A and B.
