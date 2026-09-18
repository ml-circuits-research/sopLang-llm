# 8.4.5 — Atomic Case: Coupled Objective

Scenario. In resolving software dependency constraints, two configurations are being compared for the same packages. A costs 91 units, takes 36 minutes, and has an assessed quality score of 81/100. B costs 102 units, takes 75 minutes, and scores 84/100. The decision rule was fixed in advance: minimize S = cost + 1×time − 3×quality. Colleagues propose solving “the cost problem,” “the time problem,” and “the quality problem” separately and then voting among their winners.

Main question. What is the correct decomposition, and which configuration wins under the stated rule? Best formulation (1 indivisible core). The apparent strands are clauses of one coupled model; splitting them would produce partial statements that must immediately be recombined before they mean anything.
