# 148 — Inferring a hidden state

Problem world. For insect L in this problem, the life cycle has four stages in order: egg, larva, pupa, adult. Only the adult lays eggs, and a larva cannot become an adult without passing through the pupal stage. A temperature in the suitable range may change the rate of development, but it does not change the order of the stages.

Case data. In this model, each sign listed below can be produced only by the causes listed: insufficient food for the larva → the larva grows slowly, few pupae. Temperature too low → the order remains the same, all stages last longer. Few eggs viable → the proportion larva-pupa remains normal, few larvae from the beginning. We observe the sign “the larva grows slowly”.

Question. Which hidden state remains possible? Note: we may reason from effect to cause only because the problem declares the list of causes complete within this model.
