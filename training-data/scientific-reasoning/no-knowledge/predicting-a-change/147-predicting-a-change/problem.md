# 147 — Predicting a change

Problem world. For insect L in this problem, the life cycle has four stages in order: egg, larva, pupa, adult. Only the adult lays eggs, and a larva cannot become an adult without passing through the pupal stage. A temperature in the suitable range may change the rate of development, but it does not change the order of the stages.

Case data. Before the change, the system is stable. Now we activate or increase “egg viable”. The causal rules are: viable egg → larva appears. Appears larva → can reach the pupa stage. Reaches at pupa → the adult can emerge. Appears the adult → new eggs can be laid.

Question. Predict the effects that may appear downstream. Separate the direct effect from the indirect effects.
