# 320 — Optimization under constraints

Problem world. In the model, light travels in straight lines from a source. An opaque object blocks light and can produce a shadow on a screen behind it. A transparent material lets much light pass through; a translucent material lets only some through. Shadow size can depend on the relative positions of the source, object, and screen.

Case data. The target is to obtain all of the following conditions: light available, shade visible. The forbidden effects are: beam blocked. The options are: lighting the source: cost 1, effects [light available], undesired effects [none]. Use of a opaque object: cost 1, effects [light blocked], undesired effects [none]. Alignment of the screen: cost 1, effects [shade visible], undesired effects [none]. Covering the source: cost 1, effects [light reduced], undesired effects [beam blocked].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
