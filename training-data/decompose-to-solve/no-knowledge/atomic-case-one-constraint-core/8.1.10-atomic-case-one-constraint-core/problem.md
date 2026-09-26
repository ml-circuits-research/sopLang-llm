# 8.1.10 — Atomic Case: One Constraint Core

One integer decision x specifies the number of network links to authorize. The rules are written in different places: x must be at least 44; it must not exceed 51; operations require x to be a multiple of 7; and a resource limit of 53 units must still leave a reserve of at least 4.

Question. Should this be decomposed into four problems, or reformulated as one constraint problem? What is x?
