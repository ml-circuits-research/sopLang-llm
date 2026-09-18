# 23 — If-then logical chain

Problem world. For insect L in this problem, the life cycle has four stages in order: egg, larva, pupa, adult. Only the adult lays eggs, and a larva cannot become an adult without passing through the pupal stage. A temperature in the suitable range may change the rate of development, but it does not change the order of the stages.

Case data. The local rules form a single chain: In the model, if “egg” has been completed, then “larva” can begin. In the model, if “larva” has been completed, then “pupa” can begin. In the model, if “pupa” has been completed, then “adult” can begin. We know that “egg” has been completed.

Question. What conclusions can we deduce successively? Show why each conclusion becomes a premise for the next rule.
