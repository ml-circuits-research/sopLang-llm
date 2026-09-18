# 785 — Repeated processes and recurrence

Given knowledge. Incisors cut, canines can tear, and molars crush and grind. Enamel protects the outside of the tooth. In the model, preparing a piece of food well requires cutting or tearing and then grinding before swallowing. Teeth have different shapes for different mechanical roles. Chewing increases the surface area of pieces of food.

Problem data. The state x tracks the quantity “food surface” (unit: load units). We start with x₀=2. At each cycle: we add 3, we subtract 1, then we apply the cap 12: x_(t+1)=min(12, x_t+3-1). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
