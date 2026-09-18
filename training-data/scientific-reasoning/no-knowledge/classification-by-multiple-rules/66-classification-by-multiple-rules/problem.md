# 66 — Classification by multiple rules

Problem world. In the model, light travels in straight lines from a source. An opaque object blocks light and can produce a shadow on a screen behind it. A transparent material lets much light pass through; a translucent material lets only some through. Shadow size can depend on the relative positions of the source, object, and screen.

Case data. Case A: the source is switched on: YES; the object is opaque: YES; the screen is behind the object: YES; nothing blocks the source before the object: NO. Case B: the source is switched on: YES; the object is opaque: NO; the screen is behind the object: YES; nothing blocks the source before the object: YES. Case C: the source is switched on: NO; the object is opaque: YES; the screen is behind the object: YES; nothing blocks the source before the object: YES. Case D: the source is switched on: YES; the object is opaque: YES; the screen is behind the object: YES; nothing blocks the source before the object: YES.

Question. The competition rule says that only the case meeting ALL requirements is accepted: the screen is behind the object, nothing blocks the source before the object, the object is opaque, the source is switched on; and the forbidden properties are: no additional forbidden property. Which case is accepted? It is not enough to find a case that meets only some of the conditions.
