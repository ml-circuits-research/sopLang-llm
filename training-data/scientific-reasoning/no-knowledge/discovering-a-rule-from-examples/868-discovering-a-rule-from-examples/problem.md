# 868 — Discovering a rule from examples

Given knowledge. River water flows from upstream to downstream and can carry particles or substances. In the treatment-plant model, screening stops large objects, filtration retains smaller particles, and a separate disinfection stage is required to reduce microorganisms. A particle filter does not automatically remove all dissolved substances. A pollution source upstream can affect points downstream.

Problem data. A means “large particles have been removed”, B means “fine particles have been filtered”. A box applies the same unknown logical rule: A=NO, B=NO → result=YES; A=NO, B=YES → result=NO; A=YES, B=YES → result=NO. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
