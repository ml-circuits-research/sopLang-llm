# 866 — Exhaustive case analysis

Given knowledge. River water flows from upstream to downstream and can carry particles or substances. In the treatment-plant model, screening stops large objects, filtration retains smaller particles, and a separate disinfection stage is required to reduce microorganisms. A particle filter does not automatically remove all dissolved substances. A pollution source upstream can affect points downstream.

Problem data. A=large particles have been removed; B=fine particles have been filtered; C=microorganisms have been reduced by the dedicated stage. The target result is “the water meets the treatment model requirements”. In this submodel, target appears exactly in cases in which exactly two conditions are YES. Each letter can be YES or NO.

Question. Systematically enumerate all 8 A/B/C combinations and identify exactly the favorable cases. Explain why the enumeration is complete.
