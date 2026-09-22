# Raspunsuri

Fisierul acesta este locul unde se scriu raspunsurile pentru proprietar, ca sa nu se piarda in scroll-ul
din tmux. Fiecare raspuns are data, ora (UTC) si intrebarea la care raspunde.

---

## 2026-09-22, 15:25Z — De ce a esuat chatul pe problema cu cookie-uri si pe numararea de caractere; boilerplate-ul `probe`

**Intrebarea:** ai rulat chatul si i-ai dat o problema simpla ("Emma bought 3 boxes of cookies...") si una
cu numararea caracterelor dintr-un cuvint; ambele au esuat. De ce? Si: boilerplate-ul

```
const probe = (condition, message) => { if (!condition) { throw new Error("probe failed: " + message); } };
probe(typeof $slots === "object" && ...);
probe(Object.keys($slots).length > 0, ...);
```

pare o prostie generata degeaba in fiecare exemplu; n-ar putea sa fie un tip de circuit care face
verificarile astea?

### 1. De ce a esuat chatul

**Calea de chat nu are niciun defect de "plumbing".** `evaluation/chat.mjs` trimite exact acelasi mesaj ca
antrenarea: `SYSTEM_PROMPT` din `training/export.mjs` (profilul `compiled-plan-chat-2`) plus enuntul brut ca
mesaj de user. Toate cele 7815 rânduri de export folosesc acelasi system prompt. Deci ipoteza "chat-ul
trimite un enunt brut acolo unde profilul astepta o cerere de plan compilat" este **falsa**.

Rulat read-only pe serverul care rula deja (exp-008-sft-shapes, `checkpoint-540`; nu s-a pornit niciun job
GPU nou):

- **Problema cu cookie-uri:** modelul a compilat valorile corect (**bought=3, perBox=12, toShare=8** — deci
  a citit enuntul corect), dar a aplicat **operatia greșita**: a emis `slots.bought - slots.toShare *
  slots.perBox` si a executat `-93.` in loc de `28`. Reformulata ("3 lazi, 12 borcane, se vand 8") da
  corect `28 jars.`. Deci esecul depinde de **formulare**, nu de matematica.
- **Numararea de caractere:** 2 din 4 formulari au reusit (10, corect). Una a picat cu `execution_error`
  pentru ca modelul si-a **inventat o asertiune pe care propriul calcul o incalca** ("every character must
  belong to the word's end"); una a picat cu `validation_error: Unexpected token ']'` (expresie
  splicing-uita).

**Cauza este cea stabilita de diag-009 / constatarea D-L:** modelul completeaza cea mai apropiata familie
memorata, nu operatia ceruta de enunt.

**Acoperirea in date, numarata (7815 rânduri):**

| Ce cauti | Cate rânduri | Din total |
| --- | --- | --- |
| enunturi cu "cookie" | 0 | 7815 |
| enunturi cu "shares with" / "gives away" / "hands over" | 0 | 7815 |
| forma aritmetica necesara `(X*Y)-Z` cu toti trei operatorii cititi din instanta | 112 | 7815 (1,4%) |
| forma **greșita** pe care a emis-o, `X-(Y*Z)` (sablonul de "rest") | 97 | 7815 |
| enunturi care cer numarul de caractere al unui cuvint | 0 | 7815 |
| enunturi cu "how many letters" | 41 | 7815 |

Deci modelul a ales forma `X-(Y*Z)` pentru ca **acea forma este predata de 97 de rânduri**, in timp ce forma
corecta `(X*Y)-Z` apare in 112 rânduri, dar niciunul cu aceasta formulare. Pentru caractere, cele 41 de
rânduri cu "how many letters" sunt familiile `Length Ranked Words` (40) si `Code with a length field` (1);
familiile apropiate sunt `Count Letter in Word` (40), `Words Containing Letter` (40), `Length Ranked Words`
(40), `Reverse Word` (40), `Vowel Richest Word` (40) — si **0 rânduri au ca tinta lungimea unui cuvint**.

### 2. Boilerplate-ul `probe`

**Da, apare in TOATE exemplele: 7815 din 7815 rânduri poarta harness-ul complet**, pe fiecare dintre cele
8415 fire `jsEval`. Costul, masurat cu tokenizerul modelului de baza:

| Partea | Tokeni | Din tinta |
| --- | --- | --- |
| linia `const probe = (condition, message) => ...` | 219.000 | 4,74% |
| cele trei verificari obligatorii (`$slots` de doua ori + răspunsul) | 656.000 | 14,22% |
| **harness-ul obligatoriu, total** | **875.160** | **18,96%** |
| toate liniile `probe(` impreuna (deci si asertiunile de domeniu scrise de model) | 2.024.000 | 43,85% |

Deci **18,96% din tokenii de tinta** sunt schelet fix repetat; restul de 24,89% sunt asertiuni de domeniu
pe care modelul le scrie util.

**Unde se asambleaza:** `teacher/families/probes.mjs` (functia `answerBody`) si este inserat de `buildProgram`
din `teacher/families/index.mjs`.

**Nu poate fi pur si simplu eliminat.** Doua porti il impun:
- `teacher/families/index.mjs`: refuza la incarcare orice familie al carui fir `answer` nu are cel putin 3
  apeluri `probe(`;
- `training-data/verify.mjs`: reverifica acelasi lucru pe arborele livrat (`MINIMUM_PROBES = 3`), iar
  `probeCount` si `stripProbeStatements` sunt folosite si de `provenance.mjs`.

Motivul contractual, din `DS008-training-data.md`: harness-ul face ca un input malformat sau un răspuns gol
sa se termine cu un `execution_error` structurat **in loc sa publice o valoare greșita**.

**Sugestia ta (un tip de fir care face verificarile) este corecta tehnic.** Acum harness-ul sta **in corpul
`jsEval` emis de model**, deci modelul trebuie sa-l genereze token cu token; un tip de fir poate verifica in
`execute` valorile rezolvate (`ctx.values`) inainte de a rula corpul (DS004-wire-types). Ce ar cere:

1. schimbare de runtime/parser -> **increment de versiune + migrare a datelor de antrenare** (regula din
   AGENTS.md);
2. profil nou (`compiled-plan-chat-2` -> `3`), pentru ca DS008 interzice un profil care promite alta forma
   decat tintele;
3. snapshot de dataset nou (id content-addressed) si deci **re-antrenare**;
4. un cod nou de esec in taxonomia `CLASSES` din `run-eval.mjs` si in `divergenceOf` din `run-diagnostic.mjs`;
5. mutarea impreuna a ambelor porti (`probes.mjs` + `verify.mjs`) si a validatorului de familii.

**Câstig:** 18,96% tokeni de tinta mai putin si dispare clasa de esec in care modelul isi mutileaza propriile
linii de harness (80 din 225 de eșecuri in holdout-ul exp-003, plus una din cele patru formulari testate).

**Recomandarea:** intâi arm-ul ieftin (o singura formulare canonica de harness + mesaje mai scurte, pastrând
cele trei verificari obligatorii, sub o versiune noua de profil), abia apoi ablatia "harness in tinta vs.
harness in tip de fir" — niciodata ca editare silențioasa a datasetului actual, si dupa ce raporteaza arm-ul
contrastiv care ruleaza acum. Constatarea D-L spune ca blocajul masurat este **selectarea operatiei**, nu
volumul scheletului, deci scheletul nu este prima parghie.

### 3. Ce s-a adaugat la CLI

`evaluation/chat.mjs` are acum un strat de comenzi, recunoscute **inainte** ca mesajul sa ajunga la model,
care nu sunt numarate ca ture de evaluare:

| Comanda | Ce face |
| --- | --- |
| `/help` | listeaza toate comenzile cu o linie de descriere |
| `/show-plan` | afiseaza planul ultimei ture: numele firelor, daca a executat, si divergenta daca nu |
| `/stats` | numarul de ture si totalurile de tokeni raportate de server |
| `/model` | modelul curent |
| `/export <cale>` | scrie transcriptul |
| `/exit` | iese (la fel ca `exit`, `quit`, Ctrl-D) |

Testat: `tests/chat-commands.test.mjs`, 11 teste care fixeaza decodorul (fiecare comanda listata este
recunoscuta, un cuvint cu slash necunoscut este refuzat in loc sa fie trimis, o comanda nu este forwardata).

---

## 2026-09-22, 18:00Z — Am scos "minunile" alea din datele de antrenare (verificarile cu 3 `probe`)

**Ce ai zis:** ca verificarea aia cu 3 probe e bloat, facuta doar ca sa fie, nu aduce valoare, si ca
codul ala pot sa-l injectez eu automat. Ai avut dreptate, si am masurat cat costa inainte sa-l scot.

**Cat costa:** 18,96% din tokenii de tinta (875.160 din 4.616.945), identic in toate cele 8415 fire
`jsEval`. Deci o cincime din ce invata modelul sa scrie era text fix, acelasi in fiecare exemplu.

**Ce am facut.** Cele trei verificari generice au devenit contractul comenzii `jsEval` (versiune 2.0.0,
increment de versiune cum cere regula din AGENTS.md pentru o schimbare de runtime):

- o dependinta citita de corp trebuie sa aiba valoare definita;
- un `slots` compilat trebuie sa fie obiect ne-gol;
- rezultatul nu are voie sa fie `null`, `undefined` sau sir gol.

Fiecare incalcare se termina cu `execution_error` structurat, cu numele firului si clauza incalcata.
Un corp care a facut `circuit.commit(...)` e exceptat, pentru ca acolo publicarea se face prin tranzactie
si corpul nu returneaza nimic prin constructie.

**Ce a ramas.** Asertiunile de domeniu pe care le scriu familiile („scorul nu poate fi negativ", „restul
e mai mic decat impartitorul") raman in corp, pentru ca acolo modelul chiar judeca ceva specific problemei.
Ale tale cuvinte: „daca sunt asertii custom, utile ramin, ce e doar de fatada, generic trebuie sa dispara".
Exact asa e acum: 24,89% din liniile cu `probe(` sunt de domeniu si raman, scheletul generic a disparut.

**Rezultat masurat:**

| | inainte | acum |
| --- | --- | --- |
| caractere de tinta | 18.010.872 | 14.622.102 |
| reducere | | **-3.388.770 (-18,8%)** |
| schelet generic in circuite | 8.540 din 8.540 | **0 din 8.540** |
| `verify` pe date | OK | OK |

Suita de teste: 317 din 317 trec. Profilul de chat devine `compiled-plan-chat-3`, cu un system prompt care
nu mai cere scheletul si spune explicit ca runtime-ul verifica el contractul generic.

**Doua defecte gasite pe drum, ambele pentru ca au tipat tare in loc sa treaca silentios:**

1. sonda de provenienta nu putea schimba *continutul* unui sir (lipirea unui caracter e absorbita de un
   calcul pe multimea de caractere, iar inlocuirea unei litere rare cu alta lasa numarul de litere distincte
   neschimbat), deci un circuit corect de numarat litere distincte era raportat ca „raspuns stocat"; acum
   sterge un caracter care apare o singura data, ceea ce schimba demonstrabil numarul distinct;
2. instructiunea ta de a nu pune cuvintele de demo in antrenare era incalcata de lista comuna de cuvinte:
   `raspberry` si `strawberry` sunt acum **doar pentru evaluare** (`EVAL_ONLY_WORDS`), iar **0 din 8015**
   rânduri de antrenare le mai mentioneaza.

**Despre intrebarea cu raspberry.** Da, aveai dreptate: versiunea anterioara esua sa numere r-urile.
Inainte, `raspberry` aparea doar ca un cuvant oarecare in 40 de cazuri, iar litera ceruta era aleasa
independent — deci capcana nu era niciodata pusa intentionat. Am adaugat **cinci familii auto-referentiale**:
numaratul literei pe care cuvantul insusi o numeste (unde `raspberry` are **3** r-uri, nu 2 cate isi
aminteste lumea), lungimea cuvantului, prima si ultima litera, numarul de litere distincte, si comparatia
a doua cuvinte. Cuvintele celebre sunt tinute pentru evaluare, antrenarea foloseste alte 100+ cuvinte,
deci un checkpoint care le-a memorat nu poate trece drept unul care numara.

**Cum testezi cat e de inteligent modelul:** ruleaza `node evaluation/chat.mjs`, apoi `/help` pentru comenzi.
Da-i exact intrebarile-capcana: „How many times does the letter \"r\" appear in the word \"raspberry\"?"
(raspuns corect 3) si „How many times does the letter \"s\" appear in the word \"mississippi\"?" (4).
Cu `/show-plan` vezi planul pe care l-a emis, iar `/stats` iti da numarul de ture si tokenii.
