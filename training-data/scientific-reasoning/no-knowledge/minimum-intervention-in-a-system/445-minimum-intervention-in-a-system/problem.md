# 445 — Minimum intervention in a system

Problem world. In the model, light travels in straight lines from a source. An opaque object blocks light and can produce a shadow on a screen behind it. A transparent material lets much light pass through; a translucent material lets only some through. Shadow size can depend on the relative positions of the source, object, and screen.

Case data. The system should be modified as little as possible. The targets are: light available, shade visible; forbidden effects: beam blocked. Available interventions: lighting the source: cost 1, effects [light available], undesired effects [none]. Use of a opaque object: cost 1, effects [light blocked], undesired effects [none]. Alignment of the screen: cost 1, effects [shade visible], undesired effects [none]. Covering the source: cost 1, effects [light reduced], undesired effects [beam blocked].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
