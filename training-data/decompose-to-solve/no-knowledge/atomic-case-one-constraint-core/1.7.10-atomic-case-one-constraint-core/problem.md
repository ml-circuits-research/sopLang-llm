# 1.7.10 — Atomic Case: One Constraint Core

One integer decision x specifies the number of documents to authorize. The rules are written in different places: x must be at least 101; it must not exceed 105; operations require x to be a multiple of 8; and a resource limit of 111 units must still leave a reserve of at least 7.

Question. Should this be decomposed into four problems, or reformulated as one constraint problem? What is x?
