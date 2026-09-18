# 397 — Multi-step synthesis

Problem world. For insect L in this problem, the life cycle has four stages in order: egg, larva, pupa, adult. Only the adult lays eggs, and a larva cannot become an adult without passing through the pupal stage. A temperature in the suitable range may change the rate of development, but it does not change the order of the stages.

Case data. Case D has the properties: has passed through the egg stage: YES; has passed through the larval stage: YES; has passed through the pupal stage: YES; is adult: YES. The eligibility rule requires has passed through the larval stage, has passed through the pupal stage, has passed through the egg stage, is adult. For the process, we have the following connected rules: egg → larva; larva → pupa; pupa → adult. The stated order is: egg → larva → pupa → adult.

Question. Solve at three levels: (1) is the case eligible? (2) starting from the first stage, what state do we reach after three links? (3) what is the immediate predecessor of the final stage?
