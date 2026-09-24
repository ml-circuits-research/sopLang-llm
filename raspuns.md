# Raspunsuri

Fisierul acesta este locul unde se scriu raspunsurile pentru proprietar. Contine doar ULTIMUL status:
fiecare raport nou il inlocuieste pe cel vechi.

---

## Status — 2026-09-24, 06:00Z (dimineata)

### Ce s-a antrenat peste noapte

| brat | baza | holdout (705 itemi) | procedural (480) | sonde |
| --- | --- | --- | --- | --- |
| exp-014-deep-chains | 1.5B coder, transa adanca (jsEval) | **379 (53.8%)** | 377 (78.5%) | 1/10 |
| exp-015-deep-chains-05 | 0.5B coder, transa adanca (jsEval) | **362 (51.3%)** | 361 (75.2%) | 0/10 |
| exp-016-wires | 1.5B coder, fire declarative | in curs (s-a rupt noaptea, reia din checkpoint-150) | — | — |
| exp-017-qwen3-17b | Qwen3-1.7B, fire declarative | la coada, dupa exp-016 | — | — |

Nota: eval-ul a crescut de la 585 la 705 itemi (120 de compozitii noi rezervate). Cartile raman la 2/225:
transa adanca a ridicat proceduralul dar n-a miscat granita vocabularului.

### Shootout-ul de baze (proza pe aceleasi probleme)

| baza | corecte |
| --- | --- |
| 0.5B coder | 63/585 (10.8%) |
| 1.5B coder | 30/585 (5.1%) |
| 1.5B general | 80/705 (11.3%) |
| **Qwen3-1.7B — CASTIGATOR** | **357/705 (50.6%)** |
| Gemma-3-1B | descarcare in curs (retry dupa ce prima a picat pe disc plin) |

Qwen3-1.7B e de zece ori peste coder-ul 1.5B la rationament inainte de fine-tuning.

### Incidente si reparatii

- Discul s-a umplut noaptea (descarcari + salvari) -> checkpoint-160 corupt, exp-016 a murit la pasul 160/630.
  Curatat 245 GiB (checkpoint-uri HF ale bratelor inchise), sters checkpoint-urile corupte, bratul reia din checkpoint-150.
- Gemma-3-1B: prima descarcare a picat (disc plin), retry in curs.
- Firele declarative (graphPath/aggregate/fraction) sunt implementate, testate (350/350) si setul reconstruit le contine.

### Ce ruleaza acum

1. exp-016 reia antrenarea pe fire (din checkpoint-150)
2. exp-017 pe Qwen3-1.7B pornește automat dupa lantzul lui exp-016
3. Gemma-3-1B se descarca pentru shootout-ul viitor

Disc: 265 GiB liber. Totul e detasat si supravegheat.
