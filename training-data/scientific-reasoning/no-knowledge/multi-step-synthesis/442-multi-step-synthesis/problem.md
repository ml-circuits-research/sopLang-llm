# 442 — Multi-step synthesis

Problem world. In the model, light travels in straight lines from a source. An opaque object blocks light and can produce a shadow on a screen behind it. A transparent material lets much light pass through; a translucent material lets only some through. Shadow size can depend on the relative positions of the source, object, and screen.

Case data. Case D has the properties: the source is switched on: YES; the object is opaque: YES; the screen is behind the object: YES; nothing blocks the source before the object: YES. The eligibility rule requires the screen is behind the object, nothing blocks the source before the object, the object is opaque, the source is switched on. For the process, we have the following connected rules: the source emits light → light reaches the object; light reaches the object → the opaque object blocks part of the light; the opaque object blocks part of the light → a shadowed area appears on the screen. The stated order is: the source emits light → light reaches the object → the opaque object blocks part of the light → a shadowed area appears on the screen.

Question. Solve at three levels: (1) is the case eligible? (2) starting from the first stage, what state do we reach after three links? (3) what is the immediate predecessor of the final stage?
