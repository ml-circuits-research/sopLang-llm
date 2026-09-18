# 500 — Minimum intervention in a system

Problem world. A measurement is useful only if we know what quantity was measured and in which unit. For comparisons, values must be expressed in the same unit and obtained by the same method. Repeating a measurement can show whether an unusual result is stable or only an accidental error. No conversions need to be memorized in this problem; every required conversion is stated explicitly.

Case data. The system should be modified as little as possible. The targets are: the same unit, instrument checked; forbidden effects: precision lost. Available interventions: repeating the measurement: cost 1, effects [more data], undesired effects [none]. checking the instrument: cost 1, effects [instrument checked], undesired effects [none]. converting units: cost 1, effects [the same unit], undesired effects [none]. rounding before measurement: cost 1, effects [simpler calculation], undesired effects [precision lost].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
