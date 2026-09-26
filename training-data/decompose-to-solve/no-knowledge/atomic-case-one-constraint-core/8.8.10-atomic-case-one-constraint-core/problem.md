# 8.8.10 — Atomic Case: One Constraint Core

One integer decision x specifies the number of messages to authorize. The rules are written in different places: x must be at least 39; it must not exceed 47; operations require x to be a multiple of 7; and a resource limit of 45 units must still leave a reserve of at least 3.

Question. Should this be decomposed into four problems, or reformulated as one constraint problem? What is x?
