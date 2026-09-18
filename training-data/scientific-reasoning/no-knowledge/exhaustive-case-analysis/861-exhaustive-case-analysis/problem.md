# 861 — Exhaustive case analysis

Given knowledge. In the home model, insulation slows heat transfer, natural light can reduce the use of electric lights, and electrical devices transform energy and also produce heat. The goal is comfort while using resources as efficiently as possible. Windows can provide light but can also be areas of heat transfer. A thick curtain can reduce some heat loss.

Problem data. A=heat losses have been limited; B=there is sufficient light; C=unnecessary devices are switched off. The target result is “the room reaches a comfortable state with reduced consumption”. In this submodel, target appears exactly in cases in which A is YES and at least one among B or C is YES. Each letter can be YES or NO.

Question. Systematically enumerate all 8 A/B/C combinations and identify exactly the favorable cases. Explain why the enumeration is complete.
