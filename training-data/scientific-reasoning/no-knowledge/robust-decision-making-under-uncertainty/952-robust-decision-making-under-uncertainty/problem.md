# 952 — Robust decision-making under uncertainty

Given knowledge. A mirror does not produce light; it changes the direction of light that reaches its surface. In the grid-ray model, the outgoing angle is symmetric with the incoming angle relative to the normal to the mirror. Light travels in straight lines in the uniform medium of the model. A matte surface scatters light in many directions.

Problem data. The real state is unknown. The following scenarios are still possible: only “the ray meets the mirror” is faulty, only “the mirror has a suitable orientation” is faulty, only “the route reflected is not blocked” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A, B, and C.
