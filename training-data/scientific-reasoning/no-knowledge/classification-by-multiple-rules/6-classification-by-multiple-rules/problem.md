# 6 — Classification by multiple rules

Problem world. In this model, the root absorbs water from the soil, the stem transports it toward the leaves, and the leaves use water, carbon dioxide, and light to make nutrients. If the water pathway through the stem is interrupted, the leaves may receive too little water even when the soil is moist. We will treat a healthy leaf as needing both transported water and light.

Case data. Case A: the soil is moist: YES; the stem transports water: YES; the leaf receives light: NO; the root is functional: YES. Case B: the soil is moist: YES; the stem transports water: NO; the leaf receives light: YES; the root is functional: YES. Case C: the soil is moist: NO; the stem transports water: YES; the leaf receives light: YES; the root is functional: YES. Case D: the soil is moist: YES; the stem transports water: YES; the leaf receives light: YES; the root is functional: YES.

Question. The competition rule says that only the case meeting ALL requirements is accepted: the leaf receives light, the root is functional, the soil is moist, the stem transports water; and the forbidden properties are: no additional forbidden property. Which case is accepted? It is not enough to find a case that meets only some of the conditions.
