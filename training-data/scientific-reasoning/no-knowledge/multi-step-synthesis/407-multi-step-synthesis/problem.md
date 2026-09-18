# 407 — Multi-step synthesis

Problem world. In the simplified model, inhaled air brings oxygen into the lungs; oxygen passes into the blood, and the blood carries it to the cells. Cells produce carbon dioxide, which is carried by the blood back to the lungs and then exhaled. If one transport link is blocked, stages after that link receive less of the transported substance.

Case data. Case D has the properties: air reaches the lungs: YES; oxygen passes into the blood: YES; the blood circulates: YES; oxygen reaches the cells: YES. The eligibility rule requires air reaches the lungs, oxygen reaches the cells, oxygen passes into the blood, the blood circulates. For the process, we have the following connected rules: air enters the lungs → oxygen passes into the blood; oxygen passes into the blood → the blood transports oxygen; the blood transports oxygen → oxygen reaches the cells. The stated order is: air enters the lungs → oxygen passes into the blood → the blood transports oxygen → oxygen reaches the cells.

Question. Solve at three levels: (1) is the case eligible? (2) starting from the first stage, what state do we reach after three links? (3) what is the immediate predecessor of the final stage?
