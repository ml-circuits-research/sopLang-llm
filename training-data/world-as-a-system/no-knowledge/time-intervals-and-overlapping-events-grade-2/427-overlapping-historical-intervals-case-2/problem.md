# 427 — Overlapping historical intervals: case 2

Knowledge context. Historical periods often overlap rather than forming a single neat sequence.

Given facts. Event A lasted from year 120 to 160. Event B lasted from 130 to 161. Treat intervals as continuous for this exercise.

Rules. Two intervals overlap when max(start times) < min(end times). Overlap length = min(end times) − max(start times), if positive.

Task. Did the events overlap? If so, for how many years?
