# 31 — Classification by multiple rules

Problem world. In the simplified model, inhaled air brings oxygen into the lungs; oxygen passes into the blood, and the blood carries it to the cells. Cells produce carbon dioxide, which is carried by the blood back to the lungs and then exhaled. If one transport link is blocked, stages after that link receive less of the transported substance.

Case data. Case A: air reaches the lungs: YES; oxygen passes into the blood: YES; the blood circulates: YES; oxygen reaches the cells: NO. Case B: air reaches the lungs: YES; oxygen passes into the blood: NO; the blood circulates: YES; oxygen reaches the cells: YES. Case C: air reaches the lungs: NO; oxygen passes into the blood: YES; the blood circulates: YES; oxygen reaches the cells: YES. Case D: air reaches the lungs: YES; oxygen passes into the blood: YES; the blood circulates: YES; oxygen reaches the cells: YES.

Question. The competition rule says that only the case meeting ALL requirements is accepted: air reaches the lungs, oxygen reaches the cells, oxygen passes into the blood, the blood circulates; and the forbidden properties are: no additional forbidden property. Which case is accepted? It is not enough to find a case that meets only some of the conditions.
