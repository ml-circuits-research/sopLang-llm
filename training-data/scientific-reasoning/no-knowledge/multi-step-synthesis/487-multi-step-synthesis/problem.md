# 487 — Multi-step synthesis

Problem world. In the model, a pollutant introduced into a stream can be transported downstream. Reducing pollution at its source stops part of the problem before it spreads. Cleanup downstream can help locally, but it does not necessarily replace stopping the source. A good decision compares desired effects, costs, and side effects using the given data.

Case data. Case D has the properties: the pollution source is reduced: YES; water is monitored: YES; waste are collected: YES; the habitat is not destroyed of intervention: YES. The eligibility rule requires water is monitored, waste are collected, the habitat is not destroyed of intervention, the pollution source is reduced. For the process, we have the following connected rules: the pollutant enters the stream → the water carries it downstream; the water carries it downstream → downstream organisms have been exposed; downstream organisms have been exposed → effects may appear farther from the source. The stated order is: the pollutant enters the stream → the water carries it downstream → downstream organisms have been exposed → effects may appear farther from the source.

Question. Solve at three levels: (1) is the case eligible? (2) starting from the first stage, what state do we reach after three links? (3) what is the immediate predecessor of the final stage?
