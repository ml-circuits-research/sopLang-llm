# 640 — Planning with partial dependencies

Given knowledge. Fungi and bacteria can decompose organic remains. In the model, active decomposition needs decomposers, enough water, and a suitable temperature; the matter in the remains is transformed and some substances return to the soil. Dead leaves do not disappear instantly; decomposition has stages. Strong drying can slow the activity of many decomposers.

Problem data. The dependencies are: “the remainder falls” without prerequisites; “the remains become moist” without prerequisites; “decomposers colonize” after “the remainder falls”; “the remains break into smaller pieces” after “the remains become moist”; “the substances reach the soil” after “decomposers colonize” and “the remains break into smaller pieces”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
