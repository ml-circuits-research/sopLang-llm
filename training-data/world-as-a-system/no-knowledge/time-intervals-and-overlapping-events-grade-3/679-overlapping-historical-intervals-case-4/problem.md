# 679 — Overlapping historical intervals: case 4

Knowledge context. Historical periods often overlap rather than forming a single neat sequence.

Given facts. Event A lasted from year 160 to 205. Event B lasted from 160 to 194. Treat intervals as continuous for this exercise.

Rules. Two intervals overlap when max(start times) < min(end times). Overlap length = min(end times) − max(start times), if positive.

Task. Did the events overlap? If so, for how many years?
