# 659 — Paths in a network with constraints

Given knowledge. Incisors cut, canines can tear, and molars crush and grind. Enamel protects the outside of the tooth. In the model, preparing a piece of food well requires cutting or tearing and then grinding before swallowing. Teeth have different shapes for different mechanical roles. Chewing increases the surface area of pieces of food.

Problem data. The network has bidirectional edges with the following costs: incisor zone–canine zone:1; canine zone–the swallowing zone:2; incisor zone–molar zone:2; molar zone–the tongue:1; the tongue–the swallowing zone:1; canine zone–the tongue:2. The link canine zone–the swallowing zone is closed. The starting point is “incisor zone”, the destination is “the swallowing zone”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
