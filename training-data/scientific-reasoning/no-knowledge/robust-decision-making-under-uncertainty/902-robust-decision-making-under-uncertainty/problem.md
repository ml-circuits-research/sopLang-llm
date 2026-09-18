# 902 — Robust decision-making under uncertainty

Given knowledge. Bones support the body, joints allow movement between certain bones, and muscles pull on bones when they contract. In the arm model, bending the forearm requires a movable joint, a muscle that contracts, and a bone through which the force is transmitted. Muscles pull; they do not push a bone from a distance. Different joints allow different types of movement.

Problem data. The real state is unknown. The following scenarios are still possible: only “the elbow joint can move” is faulty, only “the force is transmitted to the bone” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A and C.
