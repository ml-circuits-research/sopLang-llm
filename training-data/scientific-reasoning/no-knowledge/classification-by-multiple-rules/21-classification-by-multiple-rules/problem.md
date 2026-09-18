# 21 — Classification by multiple rules

Problem world. For insect L in this problem, the life cycle has four stages in order: egg, larva, pupa, adult. Only the adult lays eggs, and a larva cannot become an adult without passing through the pupal stage. A temperature in the suitable range may change the rate of development, but it does not change the order of the stages.

Case data. Case A: has passed through the egg stage: YES; has passed through the larval stage: YES; has passed through the pupal stage: NO; is adult: YES. Case B: has passed through the egg stage: YES; has passed through the larval stage: NO; has passed through the pupal stage: YES; is adult: NO. Case C: has passed through the egg stage: NO; has passed through the larval stage: YES; has passed through the pupal stage: YES; is adult: YES. Case D: has passed through the egg stage: YES; has passed through the larval stage: YES; has passed through the pupal stage: YES; is adult: YES.

Question. The competition rule says that only the case meeting ALL requirements is accepted: has passed through the larval stage, has passed through the pupal stage, has passed through the egg stage, is adult; and the forbidden properties are: no additional forbidden property. Which case is accepted? It is not enough to find a case that meets only some of the conditions.
