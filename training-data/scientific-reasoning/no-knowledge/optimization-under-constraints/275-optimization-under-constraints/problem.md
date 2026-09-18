# 275 — Optimization under constraints

Problem world. For insect L in this problem, the life cycle has four stages in order: egg, larva, pupa, adult. Only the adult lays eggs, and a larva cannot become an adult without passing through the pupal stage. A temperature in the suitable range may change the rate of development, but it does not change the order of the stages.

Case data. The target is to obtain all of the following conditions: larvae well fed, eggs viable. The forbidden effects are: the cycle broken. The options are: more food for larvae: cost 1, effects [larvae well fed], undesired effects [none]. Temperature suitable: cost 2, effects [development normal], undesired effects [none]. Protecting of the eggs: cost 1, effects [eggs viable], undesired effects [none]. Elimination of the pupae: cost 1, effects [lesse insects], undesired effects [the cycle broken].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
