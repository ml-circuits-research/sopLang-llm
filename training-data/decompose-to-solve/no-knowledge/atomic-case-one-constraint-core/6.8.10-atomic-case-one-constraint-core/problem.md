# 6.8.10 — Atomic Case: One Constraint Core

Scenario. In planning a multilingual translation workflow, one integer decision x specifies the number of text segments to authorize. The rules are written in different places: x must be at least 37; it must not exceed 49; operations require x to be a multiple of 9; and a resource limit of 49 units must still leave a reserve of at least 4. The document layout makes these look like separate topics, so a reader proposes four independent subproblems.

Main question. Should this be decomposed into four problems, or reformulated as one constraint problem? What is x? Best formulation (1 indivisible core). The apparent strands are clauses of one coupled model; splitting them would produce partial statements that must immediately be recombined before they mean anything.
