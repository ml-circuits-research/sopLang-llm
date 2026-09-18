# 630 — Planning with partial dependencies

Given knowledge. In the simplified model, pollination succeeds when compatible pollen reaches a flower’s stigma. A visitor can touch a flower without carrying pollen, and carrying pollen does not help if the correct part of the flower is not touched. Nectar may attract insects, but nectar is not pollen. Some plants are pollinated mainly by animals, others mainly by wind.

Problem data. The dependencies are: “the flower opens” without prerequisites; “the visitor finds the flower” without prerequisites; “pollen sticks to the visitor” after “the flower opens” and “the visitor finds the flower”; “the visitor touches another flower” after “pollen sticks to the visitor”; “pollen reaches the stigma” after “the visitor finds the flower”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
