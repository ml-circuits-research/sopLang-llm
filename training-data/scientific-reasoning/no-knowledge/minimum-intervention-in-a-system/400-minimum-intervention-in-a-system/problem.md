# 400 — Minimum intervention in a system

Problem world. For insect L in this problem, the life cycle has four stages in order: egg, larva, pupa, adult. Only the adult lays eggs, and a larva cannot become an adult without passing through the pupal stage. A temperature in the suitable range may change the rate of development, but it does not change the order of the stages.

Case data. The system should be modified as little as possible. The targets are: larvae well fed, eggs viable; forbidden effects: the cycle broken. Available interventions: more food for larvae: cost 1, effects [larvae well fed], undesired effects [none]. Temperature suitable: cost 2, effects [development normal], undesired effects [none]. Protecting of the eggs: cost 1, effects [eggs viable], undesired effects [none]. Elimination of the pupae: cost 1, effects [lesse insects], undesired effects [the cycle broken].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
