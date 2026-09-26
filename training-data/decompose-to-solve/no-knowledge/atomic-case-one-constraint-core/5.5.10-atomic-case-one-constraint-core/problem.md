# 5.5.10 — Atomic Case: One Constraint Core

One integer decision x specifies the number of route segments to authorize. The rules are written in different places: x must be at least 25; it must not exceed 31; operations require x to be a multiple of 4; and a resource limit of 32 units must still leave a reserve of at least 4.

Question. Should this be decomposed into four problems, or reformulated as one constraint problem? What is x?
