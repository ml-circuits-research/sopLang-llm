# 780 — Repeated processes and recurrence

Given knowledge. Bones support the body, joints allow movement between certain bones, and muscles pull on bones when they contract. In the arm model, bending the forearm requires a movable joint, a muscle that contracts, and a bone through which the force is transmitted. Muscles pull; they do not push a bone from a distance. Different joints allow different types of movement.

Problem data. The state x tracks the quantity “transmitted force” (unit: force units). We start with x₀=4. At each cycle: we add 4, we subtract 2, then we apply the cap 11: x_(t+1)=min(11, x_t+4-2). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
