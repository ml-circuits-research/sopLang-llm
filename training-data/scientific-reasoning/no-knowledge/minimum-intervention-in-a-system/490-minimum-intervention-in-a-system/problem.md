# 490 — Minimum intervention in a system

Problem world. In the model, a pollutant introduced into a stream can be transported downstream. Reducing pollution at its source stops part of the problem before it spreads. Cleanup downstream can help locally, but it does not necessarily replace stopping the source. A good decision compares desired effects, costs, and side effects using the given data.

Case data. The system should be modified as little as possible. The targets are: habitat protected, loading new reduced; forbidden effects: habitat destroyed. Available interventions: stopping the source: cost 2, effects [loading new reduced], undesired effects [none]. Collection waste: cost 1, effects [waste removed], undesired effects [none]. Restoration the riverbank: cost 2, effects [habitat protected], undesired effects [none]. Concreting complete a the riverbank: cost 1, effects [access easy], undesired effects [habitat destroyed].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
