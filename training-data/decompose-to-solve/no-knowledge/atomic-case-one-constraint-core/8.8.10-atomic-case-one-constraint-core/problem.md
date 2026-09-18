# 8.8.10 — Atomic Case: One Constraint Core

Scenario. In reasoning about encryption, signatures, and key handling, one integer decision x specifies the number of messages to authorize. The rules are written in different places: x must be at least 39; it must not exceed 47; operations require x to be a multiple of 7; and a resource limit of 45 units must still leave a reserve of at least 3. The document layout makes these look like separate topics, so a reader proposes four independent subproblems.

Main question. Should this be decomposed into four problems, or reformulated as one constraint problem? What is x? Best formulation (1 indivisible core). The apparent strands are clauses of one coupled model; splitting them would produce partial statements that must immediately be recombined before they mean anything.
