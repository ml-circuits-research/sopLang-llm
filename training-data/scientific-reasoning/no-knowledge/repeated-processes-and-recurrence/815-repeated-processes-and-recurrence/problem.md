# 815 — Repeated processes and recurrence

Given knowledge. For equal volumes, the material with smaller mass has lower density. In the model, an object floats in water if its average density is lower than the density of water; a hollow shape can contain air and reduce average density. A compact piece of metal can be denser than water. A metal ship can float because its total volume contains a great deal of air.

Problem data. The state x tracks the quantity “trapped air” (unit: mmodel L). We start with x₀=2. At each cycle: we add 3, we subtract 1, then we apply the cap 13: x_(t+1)=min(13, x_t+3-1). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
