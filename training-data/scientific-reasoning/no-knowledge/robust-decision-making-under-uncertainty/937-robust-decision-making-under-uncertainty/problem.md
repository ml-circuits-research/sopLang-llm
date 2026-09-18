# 937 — Robust decision-making under uncertainty

Given knowledge. For equal volumes, the material with smaller mass has lower density. In the model, an object floats in water if its average density is lower than the density of water; a hollow shape can contain air and reduce average density. A compact piece of metal can be denser than water. A metal ship can float because its total volume contains a great deal of air.

Problem data. The real state is unknown. The following scenarios are still possible: only “average density is below that of water” is faulty, only “the object does not take water into the air cavity” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A and B.
