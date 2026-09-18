# 46 — Classification by multiple rules

Problem world. Choosing a material depends on the properties required by the object, such as waterproofness, flexibility, transparency, or thermal insulation. No material is “the best” in every situation; it is suitable if it meets the requirements of its use at the same time. In this problem, the properties are stated explicitly and do not need to be guessed from everyday experience.

Case data. Case A: is waterproof: YES; is flexible: YES; is transparent: NO; provides thermal insulation: YES. Case B: is waterproof: YES; is flexible: NO; is transparent: YES; provides thermal insulation: YES. Case C: is waterproof: NO; is flexible: YES; is transparent: YES; provides thermal insulation: YES. Case D: is waterproof: YES; is flexible: YES; is transparent: YES; provides thermal insulation: YES.

Question. The competition rule says that only the case meeting ALL requirements is accepted: is flexible, is waterproof, is transparent, provides thermal insulation; and the forbidden properties are: no additional forbidden property. Which case is accepted? It is not enough to find a case that meets only some of the conditions.
