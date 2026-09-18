# 740 — Planning with partial dependencies

Given knowledge. In the home model, insulation slows heat transfer, natural light can reduce the use of electric lights, and electrical devices transform energy and also produce heat. The goal is comfort while using resources as efficiently as possible. Windows can provide light but can also be areas of heat transfer. A thick curtain can reduce some heat loss.

Problem data. The dependencies are: “temperature is measured” without prerequisites; “natural light is observed” after “temperature is measured”; “the devices have been selected” after “temperature is measured”; “energy is recorded” after “natural light is observed” and “the devices have been selected”; “comfort is compared” after “the devices have been selected”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
