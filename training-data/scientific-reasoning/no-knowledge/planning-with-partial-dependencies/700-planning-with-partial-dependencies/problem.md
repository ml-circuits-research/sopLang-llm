# 700 — Planning with partial dependencies

Given knowledge. Evaporation occurs at the surface of a liquid. In the model, a larger surface area, moving air, and a higher temperature can speed drying, while very humid air can slow it. Drying does not require water to boil. Spreading out a cloth increases its exposed surface area.

Problem data. The dependencies are: “the same amount of water is added” without prerequisites; “the material is placed” without prerequisites; “evaporation begins” after “the same amount of water is added”; “mass is measured” after “the material is placed”; “the remaining water is compared” after “evaporation begins” and “mass is measured”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
