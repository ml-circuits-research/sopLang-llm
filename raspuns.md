# Raspunsuri

Fisierul acesta este locul unde se scriu raspunsurile pentru proprietar. Contine doar ULTIMUL status:
fiecare raport nou il inlocuieste pe cel vechi.

---

## Status — 2026-09-24, 10:30Z: modelele si rezultatele lor la eval

### Modelele fine-tunate (cu rezultat la holdout)

| model | baza | versiune date | antrenat | holdout | procedural (480) |
| --- | --- | --- | --- | --- | --- |
| exp-016-wires | Qwen2.5-Coder-1.5B | dv3 — fire declarative | 2026-09-24 08:14Z | **440/705 (62.4%)** | **440 (91.7%)** |
| exp-014-deep-chains | Qwen2.5-Coder-1.5B | dv2 — transa adanca | ≈2026-09-23 17:10Z | 379/705 (53.8%) | 377 (78.5%) |
| exp-015-deep-chains-05 | Qwen2.5-Coder-0.5B | dv2 — transa adanca | ≈2026-09-23 19:53Z | 362/705 (51.3%) | 361 (75.2%) |
| exp-013-1.5b | Qwen2.5-Coder-1.5B | dv1 — inventar | ≈2026-09-23 07:59Z | 322/585 (55.0%)* | — |
| exp-012-census | Qwen2.5-Coder-0.5B | dv1 — inventar | ≈2026-09-22 22:50Z | 258/585 (44.1%)* | — |
| exp-017-qwen3-17b | Qwen3-1.7B | dv3 — fire declarative | in antrenare | — | — |

* setul de eval era de 585 de itemi; de la dv2 e de 705 (120 de compozitii noi rezervate).

Concluzia masurata: aceeasi baza 1.5B, aceleasi date — firele declarative au ridicat holdout-ul de la
379 la 440 (+61 corecte, +8.6 puncte) si au prabusit erorile de executie pe procedural de la 63 la 13.
Cartile raman la 0/225: firele ajuta unde modelul compileaza formele respective; cartile au nevoie de
familii proprii (urmatoarea transa).

### Bazele neantrenate (raspund in proza, acelasi eval)

| baza | corecte |
| --- | --- |
| Qwen2.5-Coder-0.5B | 63/585 (10.8%) |
| Qwen2.5-Coder-1.5B | 30/585 (5.1%) |
| Qwen2.5-1.5B (general) | 80/705 (11.3%) |
| Qwen3-1.7B | 357/705 (50.6%) — castigatoarea shootout-ului |

### Ce ruleaza acum

- exp-017-qwen3-17b antreneaza (Qwen3-1.7B pe fire, dv3); cand se inchide lantzul, castigatorul intra
  automat in chat cu identitatea completa (1.7B · Qwen3-1.7B · dv3 · data antrenarii).
- Sentinela de sesiune verifica la 30 de minute; disc 451 GiB; infrastructura portabila in
  skills/night-orchestration, testata 353/353.

## Status — 2026-09-25, 16:30Z: containerele au miscat cartile

### exp-021 (Qwen3-1.7B, dv7 containere): 460/705 (65.2%) — cel mai bun holdout al seriei

| carte | corecte | erori de executie |
| --- | --- | --- |
| **world-as-a-system** | **20/20 (100%)** | 0 |
| procedural | 438/480 (91.3%) | 12 |
| mathematical-thinking | 2/10 | 1 |
| decompose-to-solve | 0/100 | 8 |
| common-sense | 0/50 | 19 |
| celelalte | 0 | — |

Ipoteza containerelor e validata masurabil: prima familie de carti (world-as-a-system) a trecut de la
0 la 100%, iar runtime completion a sarit la 91.9%. Celelalte carti raman la 0 - formele lor (scheduling,
ratiune de bun-simt) nu sunt inca in vocabular. Urmeaza dv8 (refactorizarea modulara a corpurilor
monstruoase) si exp-022 - experimentul de structura pentru articol.
