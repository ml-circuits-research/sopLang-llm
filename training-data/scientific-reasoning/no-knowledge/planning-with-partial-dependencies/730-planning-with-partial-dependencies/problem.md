# 730 — Planning with partial dependencies

Given knowledge. In the greenhouse model, plants need light and water, temperature must remain within a stated range, and fruit formation in the species used requires pollination. Windows can cool and ventilate, watering adds water, and insect access can increase pollination. Too much water can reduce the air in the soil. Ventilation can lower temperature and humidity.

Problem data. The dependencies are: “the sensor measures” without prerequisites; “the intervention is decided” without prerequisites; “water is distributed” after “the sensor measures”; “temperature is regulated” after “the intervention is decided”; “pollination is checked” after “water is distributed” and “temperature is regulated”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
