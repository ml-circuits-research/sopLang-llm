# 349 — Propagation of effects through a network

Problem world. In the water-cycle model, liquid water can evaporate, water vapor can cool and condense into droplets, and sufficiently large droplets can fall as precipitation. Fallen water can collect in rivers, lakes, or soil and later re-enter the cycle. Clouds are not explained as “water smoke,” but as very small droplets formed after cooling and condensation.

Case data. The network of dependencies has the arrows: heating a of the water → more intense evaporation; water vapor in air → possible condensation at cooling; condensation → droplets; droplets large enough → precipitation. We change “heating a of the water”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
