# 930 — Overlapping historical intervals: case 5

Knowledge context. Historical periods often overlap rather than forming a single neat sequence.

Given facts. Event A lasted from year 180 to 230. Event B lasted from 190 to 227. Treat intervals as continuous for this exercise.

Rules. Two intervals overlap when max(start times) < min(end times). Overlap length = min(end times) − max(start times), if positive.

Task. Did the events overlap? If so, for how many years?
