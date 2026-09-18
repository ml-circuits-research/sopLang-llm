# 942 — Robust decision-making under uncertainty

Given knowledge. Air occupies space and can be compressed. In a model of a closed syringe, pushing the plunger decreases the volume of the air and increases pressure; if the air has a path out, pressure does not increase in the same way. Air is matter even though we cannot see it. A balloon can stretch when the pressure inside increases.

Problem data. The real state is unknown. The following scenarios are still possible: only “air is trapped” is faulty, only “the container has no leak” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A and C.
