# 947 — Robust decision-making under uncertainty

Given knowledge. Evaporation occurs at the surface of a liquid. In the model, a larger surface area, moving air, and a higher temperature can speed drying, while very humid air can slow it. Drying does not require water to boil. Spreading out a cloth increases its exposed surface area.

Problem data. The real state is unknown. The following scenarios are still possible: only “air circulates” is faulty, only “air is not already very moist” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels B and C.
