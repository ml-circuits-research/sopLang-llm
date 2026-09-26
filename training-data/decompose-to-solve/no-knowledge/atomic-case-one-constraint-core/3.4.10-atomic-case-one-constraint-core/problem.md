# 3.4.10 — Atomic Case: One Constraint Core

One integer decision x specifies the number of servings to authorize. The rules are written in different places: x must be at least 58; it must not exceed 64; operations require x to be a multiple of 5; and a resource limit of 63 units must still leave a reserve of at least 3.

Question. Should this be decomposed into four problems, or reformulated as one constraint problem? What is x?
