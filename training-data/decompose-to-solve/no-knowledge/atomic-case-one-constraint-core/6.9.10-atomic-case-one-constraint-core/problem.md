# 6.9.10 — Atomic Case: One Constraint Core

One integer decision x specifies the number of records to authorize. The rules are written in different places: x must be at least 135; it must not exceed 145; operations require x to be a multiple of 10; and a resource limit of 142 units must still leave a reserve of at least 2.

Question. Should this be decomposed into four problems, or reformulated as one constraint problem? What is x?
