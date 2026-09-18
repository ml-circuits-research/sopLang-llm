# 375 — Optimization under constraints

Problem world. A measurement is useful only if we know what quantity was measured and in which unit. For comparisons, values must be expressed in the same unit and obtained by the same method. Repeating a measurement can show whether an unusual result is stable or only an accidental error. No conversions need to be memorized in this problem; every required conversion is stated explicitly.

Case data. The target is to obtain all of the following conditions: the same unit, instrument checked. The forbidden effects are: precision lost. The options are: repeating the measurement: cost 1, effects [more data], undesired effects [none]. checking the instrument: cost 1, effects [instrument checked], undesired effects [none]. converting units: cost 1, effects [the same unit], undesired effects [none]. rounding before measurement: cost 1, effects [simpler calculation], undesired effects [precision lost].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
