# 260 — Optimization under constraints

Problem world. In this model, the root absorbs water from the soil, the stem transports it toward the leaves, and the leaves use water, carbon dioxide, and light to make nutrients. If the water pathway through the stem is interrupted, the leaves may receive too little water even when the soil is moist. We will treat a healthy leaf as needing both transported water and light.

Case data. The target is to obtain all of the following conditions: moist soil, transport through stem. The forbidden effects are: transport broken. The options are: watering: cost 1, effects [water at root, moist soil], undesired effects [none]. Release of the stem: cost 2, effects [transport through stem], undesired effects [none]. Moving at light: cost 1, effects [light at leaves], undesired effects [none]. Cutting of the stem: cost 1, effects [shortens the plant], undesired effects [transport broken].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
