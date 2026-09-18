# 350 — Optimization under constraints

Problem world. In the water-cycle model, liquid water can evaporate, water vapor can cool and condense into droplets, and sufficiently large droplets can fall as precipitation. Fallen water can collect in rivers, lakes, or soil and later re-enter the cycle. Clouds are not explained as “water smoke,” but as very small droplets formed after cooling and condensation.

Case data. The target is to obtain all of the following conditions: condensation, evaporation. The forbidden effects are: collection blocked. The options are: heating moderate: cost 1, effects [evaporation], undesired effects [none]. Cooling of the zone of up: cost 2, effects [condensation], undesired effects [none]. Collector open: cost 1, effects [water collected], undesired effects [none]. Sealing without output: cost 1, effects [water vapor retained], undesired effects [collection blocked].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
