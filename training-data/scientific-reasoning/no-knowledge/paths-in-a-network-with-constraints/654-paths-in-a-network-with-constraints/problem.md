# 654 — Paths in a network with constraints

Given knowledge. Bones support the body, joints allow movement between certain bones, and muscles pull on bones when they contract. In the arm model, bending the forearm requires a movable joint, a muscle that contracts, and a bone through which the force is transmitted. Muscles pull; they do not push a bone from a distance. Different joints allow different types of movement.

Problem data. The network has bidirectional edges with the following costs: the shoulder–the arm:1; the arm–the hand:2; the shoulder–the elbow:2; the elbow–forearm:1; forearm–the hand:1; the arm–forearm:2. The elbow–forearm link is closed. The starting point is “the shoulder”, the destination is “the hand”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
