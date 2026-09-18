# 432 — Multi-step synthesis

Problem world. In our model, water may be solid, liquid, or water vapor. Sufficient heating can cause melting or evaporation, and cooling can cause condensation or freezing. A change of state does not mean that the water has ceased to exist; only the form in which we observe it has changed. We use only the heating and cooling relationships stated here, without relying on memorized temperature values.

Case data. Case D has the properties: is heated: YES; can flows: YES; is cooled: YES; is in a container closed: YES. The eligibility rule requires is cooled, is heated, is in a container closed, can flows. For the process, we have the following connected rules: the ice receives heat → the ice melts; the ice melts → liquid water receives more heat; liquid water receives more heat → part turns into vapor. The stated order is: the ice receives heat → the ice melts → liquid water receives more heat → part turns into vapor.

Question. Solve at three levels: (1) is the case eligible? (2) starting from the first stage, what state do we reach after three links? (3) what is the immediate predecessor of the final stage?
