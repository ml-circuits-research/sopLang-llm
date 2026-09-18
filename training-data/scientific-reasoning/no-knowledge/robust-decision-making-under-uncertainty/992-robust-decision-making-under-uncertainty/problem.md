# 992 — Robust decision-making under uncertainty

Given knowledge. River water flows from upstream to downstream and can carry particles or substances. In the treatment-plant model, screening stops large objects, filtration retains smaller particles, and a separate disinfection stage is required to reduce microorganisms. A particle filter does not automatically remove all dissolved substances. A pollution source upstream can affect points downstream.

Problem data. The real state is unknown. The following scenarios are still possible: only “large particles have been removed” is faulty, only “fine particles have been filtered” is faulty, only “microorganisms have been reduced by the dedicated stage” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A, B, and C.
