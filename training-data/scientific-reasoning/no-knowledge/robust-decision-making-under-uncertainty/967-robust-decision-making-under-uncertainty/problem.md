# 967 — Robust decision-making under uncertainty

Given knowledge. Energy can be transferred and transformed. In the model, a battery stores chemical energy, a circuit transfers it electrically, a bulb produces light and heat, and a motor produces motion and heat. A device does not create energy from nothing. Useful energy depends on the purpose of the device.

Problem data. The real state is unknown. The following scenarios are still possible: only “the transfer path works” is faulty, only “the suitable converter is connected” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels B and C.
