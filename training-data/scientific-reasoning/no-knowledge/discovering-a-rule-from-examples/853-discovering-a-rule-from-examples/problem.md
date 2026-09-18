# 853 — Discovering a rule from examples

Given knowledge. In the greenhouse model, plants need light and water, temperature must remain within a stated range, and fruit formation in the species used requires pollination. Windows can cool and ventilate, watering adds water, and insect access can increase pollination. Too much water can reduce the air in the soil. Ventilation can lower temperature and humidity.

Problem data. A means “the water is within the range”, B means “temperature is within range”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=NO; A=YES, B=YES → result=YES. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
