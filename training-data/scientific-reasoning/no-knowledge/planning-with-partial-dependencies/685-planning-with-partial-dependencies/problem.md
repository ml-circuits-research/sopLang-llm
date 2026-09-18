# 685 — Planning with partial dependencies

Given knowledge. An object remains stable in the model if the projection of its center of mass stays above its base of support. A wider base or moving mass inward can increase stability. In the model, the center of mass is the point at which we can treat mass as concentrated for balance analysis. Raising mass higher can make the system easier to tip.

Problem data. The dependencies are: “the base is positioned” without prerequisites; “the load is secured” without prerequisites; “the center of mass is located” after “the base is positioned”; “the model is tilted” after “the load is secured”; “whether it returns is observed” after “the center of mass is located” and “the model is tilted”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
