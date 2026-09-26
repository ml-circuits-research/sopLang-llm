# 2.9.10 — Atomic Case: One Constraint Core

One integer decision x specifies the number of shipments to authorize. The rules are written in different places: x must be at least 56; it must not exceed 70; operations require x to be a multiple of 9; and a resource limit of 66 units must still leave a reserve of at least 3.

Question. Should this be decomposed into four problems, or reformulated as one constraint problem? What is x?
