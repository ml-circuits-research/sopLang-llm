# 475 — Minimum intervention in a system

Problem world. In the water-cycle model, liquid water can evaporate, water vapor can cool and condense into droplets, and sufficiently large droplets can fall as precipitation. Fallen water can collect in rivers, lakes, or soil and later re-enter the cycle. Clouds are not explained as “water smoke,” but as very small droplets formed after cooling and condensation.

Case data. The system should be modified as little as possible. The targets are: condensation, evaporation; forbidden effects: collection blocked. Available interventions: heating moderate: cost 1, effects [evaporation], undesired effects [none]. Cooling of the zone of up: cost 2, effects [condensation], undesired effects [none]. Collector open: cost 1, effects [water collected], undesired effects [none]. Sealing without output: cost 1, effects [water vapor retained], undesired effects [collection blocked].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
