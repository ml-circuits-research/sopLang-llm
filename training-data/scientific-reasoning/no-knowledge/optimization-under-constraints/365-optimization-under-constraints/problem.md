# 365 — Optimization under constraints

Problem world. In the model, a pollutant introduced into a stream can be transported downstream. Reducing pollution at its source stops part of the problem before it spreads. Cleanup downstream can help locally, but it does not necessarily replace stopping the source. A good decision compares desired effects, costs, and side effects using the given data.

Case data. The target is to obtain all of the following conditions: habitat protected, loading new reduced. The forbidden effects are: habitat destroyed. The options are: stopping the source: cost 2, effects [loading new reduced], undesired effects [none]. Collection waste: cost 1, effects [waste removed], undesired effects [none]. Restoration the riverbank: cost 2, effects [habitat protected], undesired effects [none]. Concreting complete a the riverbank: cost 1, effects [access easy], undesired effects [habitat destroyed].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
