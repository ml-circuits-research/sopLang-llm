# 132 — Predicting a change

Problem world. In this model, the root absorbs water from the soil, the stem transports it toward the leaves, and the leaves use water, carbon dioxide, and light to make nutrients. If the water pathway through the stem is interrupted, the leaves may receive too little water even when the soil is moist. We will treat a healthy leaf as needing both transported water and light.

Case data. Before the change, the system is stable. Now we activate or increase “moist soil”. The causal rules are: moist soil → the root can absorb water. The root can absorb water → water enters the stem. Water enters stem → water reaches the leaves. Water reaches leaves → the leaves remain hydrated.

Question. Predict the effects that may appear downstream. Separate the direct effect from the indirect effects.
