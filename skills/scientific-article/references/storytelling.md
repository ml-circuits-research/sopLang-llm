# Finding the story and telling it

A reviewer decides in the first page whether the paper is worth their time. They are asking three things: what problem is this, why is it interesting, and what will I know after reading that I did not know before. Everything in this reference serves those three questions.

## The lesson test

Before outlining, write the paper's lesson as a sentence addressed to a researcher who will never use your system:

- Weak: "Specialized commands increase exact matching from 53.8% to 62.4%." (a number about someone else's system)
- Weak: "Abstraction helps small models." (naive, unfalsifiable, not what was shown)
- Strong: "A small model fine-tuned to write programs generalizes to new combinations of operations it has been taught, but not to problems whose solution needs an operation outside that set; more data of the same kind, a larger model in the same range, and prompt-level help did not move that boundary, while adding the missing operations did."

The strong form names a condition, an observed regularity, its boundary, and the evidence pattern behind it. If you cannot write this sentence, you do not yet have a paper; go back to the research history.

## Kinds of hook

Open the introduction (and usually the abstract) with one of these, grounded in the actual study:

- The puzzle: an observation that contradicts a reasonable expectation. "After fine-tuning, every program the model wrote was syntactically valid, and none of them answered a new kind of problem."
- The stakes: a decision practitioners make blindly that this study informs. "Anyone fine-tuning a small model on synthetic data must decide what to generate more of."
- The instrument surprise: the measurement itself turned out to be the finding. "A careful human-quality solver scored 2 of 20 on the benchmark our models were failing."
- The reversal: the obvious fix made things worse, and why. "Splitting programs into smaller, cleaner steps doubled the execution failures."

A hook must be true of the study, specific, and resolved by the paper. Do not open with the general importance of AI, a definition, or a survey of the field.

## Abstract shape

Five to seven sentences, in this order, 150–250 words:

1. Context and problem, concretely (what people try to do and what goes wrong).
2. The gap or puzzle: what is not known, or what the obvious approach gets wrong.
3. What the study did, in one sentence, naming the system in plain words.
4. The main finding as an insight, stated qualitatively; one number only if the magnitude is itself the point (for example, a boundary between none and all).
5. The secondary finding or the mechanism.
6. The implication: what a reader should do or believe differently, with its scope.

Never in an abstract: run identifiers, "Experiment A/B/C", more than two numbers, a list of limitations, the audit procedure, the number of reconstructed records, promises about future work.

## Introduction shape

Hook paragraph; what prior work established (named researchers, specific results); the precise gap; what this study does and why its setting can answer the question; the contributions as two to four sentences stating findings, not activities ("we show that ..." rather than "we reconstruct ..."); a one-line roadmap only if the structure is unusual.

## Results as a narrative

When the research unfolded as a sequence of hypotheses, tell it that way: each subsection states the hypothesis the previous result raised, what was changed, what happened, and what that ruled out. Readers remember "we tried the obvious fix and it failed for this reason" far better than a ten-row table. Use tables to hold the complete numbers the narrative refers to.

Each result paragraph has three layers, in this order: what was observed; what it most plausibly means; what alternative remains and what would distinguish them. Keep the third layer short and do it once per finding.

Show at least one real artifact per key finding: a failing program excerpt, a pair of answers, a before/after statement. Label it as observed and give its source in the supplement.

## Discussion shape

Start with the answer to the paper's question in one paragraph. Then relate each finding to named prior work: which result it confirms, extends, or complicates. Then the practical consequence for someone doing similar work. Then threats to validity, in one section, ordered by potential impact, each paired with the test that would resolve it. End with the open question the study makes answerable, not a list of future features.

## Portfolio of several papers from one programme

Build a table before writing: paper, audience, question, lesson, core evidence, secondary evidence, what it deliberately omits. Check:

- Each lesson is different in kind (a learning regularity; a design principle; a measurement-validity lesson; an accountability argument), not the same lesson reworded.
- The headline evidence differs. Shared background is fine; a shared central table is not.
- Each paper would still be worth reading if the reader had read the others.

If fewer papers pass this check than were requested, write fewer and say why.

## Tone

Confident where the evidence is strong, explicit where it is not, never defensive. Active voice with concrete subjects. Numbers serve sentences, not the other way round. Cut: "it is important to note", "we interpret", "this does not establish" (unless stating the single scope limit that matters), rhetorical contrasts, and any sentence a reader would skip.
