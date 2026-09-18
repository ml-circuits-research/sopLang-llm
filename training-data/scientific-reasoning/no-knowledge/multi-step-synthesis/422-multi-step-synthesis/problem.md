# 422 — Multi-step synthesis

Problem world. Choosing a material depends on the properties required by the object, such as waterproofness, flexibility, transparency, or thermal insulation. No material is “the best” in every situation; it is suitable if it meets the requirements of its use at the same time. In this problem, the properties are stated explicitly and do not need to be guessed from everyday experience.

Case data. Case D has the properties: is waterproof: YES; is flexible: YES; is transparent: YES; provides thermal insulation: YES. The eligibility rule requires is flexible, is waterproof, is transparent, provides thermal insulation. For the process, we have the following connected rules: we establish the requirements → we test the properties; we test the properties → we eliminate the materials unsuitable; we eliminate the materials unsuitable → we choose the material which meets all the requirements. The stated order is: we establish the requirements → we test the properties → we eliminate the materials unsuitable → we choose the material which meets all the requirements.

Question. Solve at three levels: (1) is the case eligible? (2) starting from the first stage, what state do we reach after three links? (3) what is the immediate predecessor of the final stage?
