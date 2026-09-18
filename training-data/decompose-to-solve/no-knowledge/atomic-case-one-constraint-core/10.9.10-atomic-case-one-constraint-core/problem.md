# 10.9.10 — Atomic Case: One Constraint Core

Scenario. In planning a community renewable-energy project, one integer decision x specifies the number of project components to authorize. The rules are written in different places: x must be at least 50; it must not exceed 53; operations require x to be a multiple of 4; and a resource limit of 59 units must still leave a reserve of at least 7. The document layout makes these look like separate topics, so a reader proposes four independent subproblems.

Main question. Should this be decomposed into four problems, or reformulated as one constraint problem? What is x? Best formulation (1 indivisible core). The apparent strands are clauses of one coupled model; splitting them would produce partial statements that must immediately be recombined before they mean anything.
