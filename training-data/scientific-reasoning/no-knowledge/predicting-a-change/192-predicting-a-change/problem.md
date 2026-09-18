# 192 — Predicting a change

Problem world. In the model, light travels in straight lines from a source. An opaque object blocks light and can produce a shadow on a screen behind it. A transparent material lets much light pass through; a translucent material lets only some through. Shadow size can depend on the relative positions of the source, object, and screen.

Case data. Before the change, the system is stable. Now we activate or increase “source lit”. The causal rules are: source lit → light toward object. Light toward object → the object receives light. Opaque object → a part from light is blocked. Light blocked → shade on screen.

Question. Predict the effects that may appear downstream. Separate the direct effect from the indirect effects.
