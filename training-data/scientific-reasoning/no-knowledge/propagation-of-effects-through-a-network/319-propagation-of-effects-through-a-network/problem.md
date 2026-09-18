# 319 — Propagation of effects through a network

Problem world. In the model, light travels in straight lines from a source. An opaque object blocks light and can produce a shadow on a screen behind it. A transparent material lets much light pass through; a translucent material lets only some through. Shadow size can depend on the relative positions of the source, object, and screen.

Case data. The network of dependencies has the arrows: source lit → light toward object; light toward object → the object receives light; opaque object → a part from light is blocked; light blocked → shade on screen. We change “source lit”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
