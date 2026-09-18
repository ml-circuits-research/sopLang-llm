# 763 — Following water from Pine River

Knowledge context. River systems form directed networks: water has a direction, tributaries join larger streams, and upstream/downstream are relational concepts.

Given facts. Pine River flows into Meadow River; Silver River flows into Meadow River; Meadow River flows into North Fork. A canal diverts some water from Silver River to a reservoir, but the remaining flow still reaches Meadow River.

Rules. If river X flows into river Y, X is upstream of Y. Upstream relations can be followed through several confluences. Downstream is the reverse direction of flow.

Task. Is Pine River upstream of Meadow River? Can water from Pine River reach Meadow River through the stated network?
