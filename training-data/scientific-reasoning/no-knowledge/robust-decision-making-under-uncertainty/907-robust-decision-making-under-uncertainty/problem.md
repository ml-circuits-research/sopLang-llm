# 907 — Robust decision-making under uncertainty

Given knowledge. Incisors cut, canines can tear, and molars crush and grind. Enamel protects the outside of the tooth. In the model, preparing a piece of food well requires cutting or tearing and then grinding before swallowing. Teeth have different shapes for different mechanical roles. Chewing increases the surface area of pieces of food.

Problem data. The real state is unknown. The following scenarios are still possible: only “the piece is broken into smaller pieces” is faulty, only “the path for swallowing is clear” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels B and C.
