# 729 — Paths in a network with constraints

Given knowledge. In the greenhouse model, plants need light and water, temperature must remain within a stated range, and fruit formation in the species used requires pollination. Windows can cool and ventilate, watering adds water, and insect access can increase pollination. Too much water can reduce the air in the soil. Ventilation can lower temperature and humidity.

Problem data. The network has bidirectional edges with the following costs: the tank–the plant layer:1; the plant layer–the central sensor:2; the tank–the window of ventilation:2; the window of ventilation–zone with insects:1; zone with insects–the central sensor:1; the plant layer–zone with insects:2. The layer of plants–the central sensor link is closed. The starting point is “the tank”, the destination is “the central sensor”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
