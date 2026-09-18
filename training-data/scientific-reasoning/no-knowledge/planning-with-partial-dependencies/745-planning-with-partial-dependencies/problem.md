# 745 — Planning with partial dependencies

Given knowledge. River water flows from upstream to downstream and can carry particles or substances. In the treatment-plant model, screening stops large objects, filtration retains smaller particles, and a separate disinfection stage is required to reduce microorganisms. A particle filter does not automatically remove all dissolved substances. A pollution source upstream can affect points downstream.

Problem data. The dependencies are: “water reaches the outlet” without prerequisites; “sieving is performed” without prerequisites; “filtration is performed” after “water reaches the outlet”; “the disinfection stage is applied” after “sieving is performed”; “the final sample is checked” after “filtration is performed” and “the disinfection stage is applied”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
