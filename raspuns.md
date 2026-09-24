# Raspunsuri

Fisierul acesta este locul unde se scriu raspunsurile pentru proprietar. Contine doar ULTIMUL status:
fiecare raport nou il inlocuieste pe cel vechi.

---

## Status — 2026-09-24, 10:00Z

### Firele declarative au castigat — masurat

| brat | baza | set | holdout (705) | procedural (480) | erori de executie pe procedural |
| --- | --- | --- | --- | --- | --- |
| exp-014 | 1.5B coder | jsEval | 379 (53.8%) | 377 (78.5%) | 201 total |
| **exp-016-wires** | 1.5B coder | **fire declarative** | **440 (62.4%)** | **440 (91.7%)** | **13** |

Aceeasi baza, aceeasi reteta, aceleasi date - singura diferenta e ca circuitele generate folosesc
graphPath/aggregate/fraction in loc de JavaScript. +61 de raspunsuri corecte (+8.6 puncte), iar erorile
de executie pe procedural s-au prabusit (13 fata de sute). Cartile raman la 0/225: firele ajuta unde
modelul compileaza formele, iar cartile au nevoie de familii proprii (urmatoarea transa).

### Ce ruleaza acum

- **exp-017-qwen3-17b** antreneaza pe acelasi set cu fire, pe baza castigatoare din shootout
  (Qwen3-1.7B, 357/705 in proza) - lansat prin poarta noua de preflight.
- Sentinela de sesiune verifica la 30 de minute (disc 451 GiB, totul OK).

### Infrastructura

Toata monitorizarea e portabila in skills/night-orchestration (preflight, lib-watch, disk-guard,
stall-check, health-check, session-sentinel), testata 353/353, adaptoare subtiri in repo.
