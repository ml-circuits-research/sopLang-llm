# 1.1.10 — Atomic Case: One Constraint Core

Scenario. In household faults and maintenance observations, one integer decision x specifies the number of observations to authorize. The rules are written in different places: x must be at least 71; it must not exceed 81; operations require x to be a multiple of 7; and a resource limit of 81 units must still leave a reserve of at least 4. The document layout makes these look like separate topics, so a reader proposes four independent subproblems.

Main question. Should this be decomposed into four problems, or reformulated as one constraint problem? What is x? Best formulation (1 indivisible core). The apparent strands are clauses of one coupled model; splitting them would produce partial statements that must immediately be recombined before they mean anything.
