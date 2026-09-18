# 629 — Paths in a network with constraints

Given knowledge. In the simplified model, pollination succeeds when compatible pollen reaches a flower’s stigma. A visitor can touch a flower without carrying pollen, and carrying pollen does not help if the correct part of the flower is not touched. Nectar may attract insects, but nectar is not pollen. Some plants are pollinated mainly by animals, others mainly by wind.

Problem data. The network has bidirectional edges with the following costs: the lavender bed–the clover bed:1; the clover bed–the insect shelter:2; the lavender bed–the central path:2; the central path–the mint corner:1; the mint corner–the insect shelter:1; the clover bed–the mint corner:2. The layer with clover–the insect shelter link is closed. The starting point is “the lavender bed”, the destination is “the insect shelter”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
