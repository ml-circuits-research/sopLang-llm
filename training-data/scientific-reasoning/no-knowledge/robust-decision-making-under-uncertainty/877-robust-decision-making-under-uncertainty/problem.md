# 877 — Robust decision-making under uncertainty

Given knowledge. In the simplified model, pollination succeeds when compatible pollen reaches a flower’s stigma. A visitor can touch a flower without carrying pollen, and carrying pollen does not help if the correct part of the flower is not touched. Nectar may attract insects, but nectar is not pollen. Some plants are pollinated mainly by animals, others mainly by wind.

Problem data. The real state is unknown. The following scenarios are still possible: only “the visitor carries compatible pollen” is faulty, only “the visitor touches the stigma” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A and B.
