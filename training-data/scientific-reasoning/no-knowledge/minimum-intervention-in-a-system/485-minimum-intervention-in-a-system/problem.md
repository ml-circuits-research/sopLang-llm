# 485 — Minimum intervention in a system

Problem world. In our model, rock fragments can be broken off by weathering, transported by water or wind, and then deposited when the transporting agent loses energy. Repeated deposits can form layers. Traces or remains of organisms can become trapped in sediments and, under certain conditions, become fossils. A fossil does not form instantly; the problem uses only the logical order of the stages, not their real duration.

Case data. The system should be modified as little as possible. The targets are: deposition, layer preserved; forbidden effects: deposition reduced. Available interventions: reducing the speed of the water: cost 1, effects [deposition], undesired effects [none]. Adding of a collector: cost 2, effects [sediments collected], undesired effects [none]. Protecting the layer: cost 1, effects [layer preserved], undesired effects [none]. Increasing sudden a the speed: cost 1, effects [transport increased], undesired effects [deposition reduced].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
