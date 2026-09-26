# 2.1.10 — Atomic Case: One Constraint Core

One integer decision x specifies the number of connections to authorize. The rules are written in different places: x must be at least 93; it must not exceed 101; operations require x to be a multiple of 9; and a resource limit of 106 units must still leave a reserve of at least 7.

Question. Should this be decomposed into four problems, or reformulated as one constraint problem? What is x?
