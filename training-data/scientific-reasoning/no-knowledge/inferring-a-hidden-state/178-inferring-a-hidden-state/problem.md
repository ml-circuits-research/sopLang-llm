# 178 — Inferring a hidden state

Problem world. Our model mixture contains iron filings, pebbles, sand, and salt dissolved in water. A magnet attracts the iron filings; a sieve separates larger particles from smaller ones; filtration can retain sand while water passes through; evaporating the water can leave the salt behind. A method must be chosen according to the property that differs between the components.

Case data. In this model, each sign listed below can be produced only by the causes listed: iron remaining in mixture → the magnet was not used, particles magnetic remain. Sand in liquid → filtration is missing, the liquid is cloudy. Salt invisible → water is still present, salt is dissolved. We observe the sign “filtration is missing”.

Question. Which hidden state remains possible? Note: we may reason from effect to cause only because the problem declares the list of causes complete within this model.
