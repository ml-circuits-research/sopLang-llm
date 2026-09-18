# 645 — Planning with partial dependencies

Given knowledge. Soil is a mixture that may contain mineral particles, humus, water, and air. In the model, a good layer for roots must retain some water while also leaving air spaces; too much water without air, or drainage that is too fast, can create problems. Sand generally has larger particles than clay. Humus comes from transformed organic remains.

Problem data. The dependencies are: “the same amount of water is poured” without prerequisites; “water enters the pores” without prerequisites; “a part is retained” after “the same amount of water is poured” and “water enters the pores”; “part drains away” after “a part is retained”; “the results have compared” after “water enters the pores”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
