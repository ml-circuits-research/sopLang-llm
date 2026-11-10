# Scientific manuscript audit

Audit the manuscript against the underlying records, not against another summary of the same records. This procedure applies to a completed draft and repeats after material corrections.

## Evidence pass

1. Resolve model identity through manifest contents and launch configuration. Do not infer decimal points or parameter counts from a directory name.
2. Recount item outcomes and reconcile them with summary metrics. Assert unique item identifiers, expected denominators, exhaustive outcomes, and matching sums in all tables.
3. Join comparison arms by identifier. Count additions, removals, changed targets, and changed plan identities. Where historical statements are unavailable, state that content equivalence cannot be fully re-established.
4. Verify selection and training separately. Record seeds, target-token exposure, dataset versions, base revisions, and training finish times. Similar recipes are not identical exposure; one run per treatment is not replication.
5. Identify the unit of generalization. Twenty items from one family are not twenty independent families. Repeatedly inspected held-out items form a development benchmark even if their exact strings never entered training.
6. For a judge-based result, require the rubric, candidate population, exclusions, judge identity where available, per-item verdicts, and aggregation. Disjoint judge batches are not inter-rater agreement. Missing labels prevent reaggregation.
7. Inspect examples that test the central interpretation. Check that a successful-looking number is attached to the correct entity, unit, sign, condition, and decision. Document ambiguous cases rather than awarding them automatically.
8. Bind artifacts with hashes. Preserve original records; write corrections and new analyses alongside them.

## Reader pass (run first; most drafts fail here)

Give the abstract and introduction to a reader who knows the field but not the project, and answer in writing: What is the problem? Why is it interesting? What is the one lesson, and could I apply it to my own work? If any answer is missing or is a number about the authors' system, the draft fails regardless of its accuracy.

Then check these failure signatures and fix every hit:

1. More than two numbers, any run identifier, "Experiment A/B/C", or a limitation list in the abstract.
2. The paper's headline comes from the most convenient or most recent runs while larger, more informative contrasts in the research history are absent.
3. The same caveat appears in more than two places, or caveats outnumber findings in any section.
4. The audit of the evidence is presented as the contribution in a paper whose subject is not research practice.
5. Two papers of a portfolio share their headline table, headline number, or conclusion.
6. A claim is naive: a universal law from one project, a model-size contest, a causal verb for an uncontrolled comparison, an unmeasured saving.
7. A result section lists conditions without saying what hypothesis each tested and what its outcome ruled out.
8. No real artifact (program, answer pair, statement) illustrates the key finding.
9. Results are given as bare counts over different denominators, so the reader must divide to compare; or a sample size is introduced without saying why it suffices; or a difference smaller than the sample can resolve is interpreted.

## Adversarial verification pass

Commission a separate reviewer (a different agent session or person) whose only instruction is to find reasons the claims are false, one reviewer per one or two manuscripts, writing findings to disk as it goes so an interruption does not lose them. Give it the manuscripts, the evidence files, and the raw records, not your summary of them. Then check every finding yourself against the records before accepting or rejecting it. The failure classes below were all found this way in a real portfolio after the authors' own audit had passed; check each one explicitly:

1. "Reproduced" must name what was recomputed. Re-applying the function that produced a label to its own inputs, or comparing totals written by the same harness, is not reproduction. When a paper claims computations are reliable, re-execute the stored artifacts end to end.
2. For every "X changed Y" claim, look at every later run or condition, not only the first. A result that holds once and fails in the next two runs is a different finding. Replace "when and only when" with the observed series.
3. A headline positive result needs a "before" on the same slice, or an explicit statement that none exists and the nearest partial comparison. List every other change made in the same data version or run as a confound.
4. Name the strongest alternative mechanism that fits the same numbers (for example "same generator" against "same operator vocabulary") and say whether the data can separate them.
5. Describe failure mechanisms from item records, not from earlier narrative. Read a sample of each failure class; "answered a different question" and "made an arithmetic error" are different findings.
6. Quote inputs exactly as the system saw them at the time (the historical version), and say when a quotation is abridged or translated.
7. Define every index or category from its implementation, not its intended meaning (a fingerprint of program text is not a fingerprint of computation).
8. State the effective sample: how many distinct programs, families, or templates stand behind a count of items.
9. Treat counter-cases and success stories with the same scepticism as headlines: check what happened after the governance device worked, and whether it was later overridden.
10. Check attributions of acts to people or agents against what the records can actually show.
11. For double-anonymous venues, search the manuscript for file names, run names, system names, and exact timestamps that identify the authors through a public repository.
12. Reconcile every count stated in prose with the tables, and every date against the version history.
13. When a comparison varies a condition (wording, prompt, model), confirm that every condition was scored on the same items. A seeded sample keyed on item identifiers that carry a variant suffix silently draws different items per condition.
14. For judge-based scoring, use two independent judges on the same items, blind to the condition, with injected known-wrong items and items a deterministic rule proves correct, and retain every verdict. Report agreement and calibration beside the result. A deterministic value check is not a substitute where answers state verdicts in free form.
15. When models are evaluated through agent sessions rather than independent API calls, a session sees its whole batch. Never put two conditions of the same problem (two wordings, or a direct and a code condition) in one batch: the agent can carry an answer across them, which makes paired comparisons meaningless. Audit each session's tool use, retain the session transcripts so the audit can be re-checked, and discard batches whose replies were produced by scripts or by executing code. Identical answers across two conditions do not by themselves prove carry-over; a capable model may give the same answer independently, so the batch design, not the numbers, is what must be checked. Put calibration items into every judging pass, including passes added later.

## Argument pass

Read as a newcomer: can the reader explain the system, read its minimal example, identify each experimental condition, and state what the comparison changes without opening the repository? Reject unexplained internal run labels in the main text. Check that each article selects evidence appropriate to its own question. Quantitative comparisons must name both conditions, identify the metric and denominator, and state the practical interpretation. If percentages lead the presentation, check their rounding against retained counts.

Write a one-line purpose for every section and one premise/conclusion pair for each major claim. Remove a section if it contributes neither evidence nor a needed step in the argument. Check that the abstract reports the same study, denominators, and limitations as the body. Distinguish observed association, a controlled comparison's intended intervention, a plausible mechanism, and a causal conclusion.

Act as a skeptical reviewer: formulate the strongest alternative explanation for each claimed contribution. Address it with existing evidence or narrow the claim. Test whether a negative result is being turned into a universal prohibition, a software test into a proof, or one project into a claim about all scientists. Avoid prescriptive language whose premise is merely anecdotal.

## Bibliography pass

For every cited work, verify bibliographic identity and a source passage that supports the nearby claim. Record access failures honestly. A primary abstract may verify a method's purpose, but detailed theorem, quantitative, or implementation claims require the corresponding full-text section. Prefer one precise attribution over a string of loosely related citations. Check for uncited references, unknown keys, mismatched years, duplicate works under different keys, and unsupported additions made during prose polishing.

## Journal and publication pass

Check official scope, manuscript category, length, abstract, references, figures, anonymity, declarations, and accepted files. Record requirements separately from stylistic choices. Do not fabricate a received date, journal volume, DOI, grant number, author affiliation, ethics approval, or funding declaration. Prepare missing human declarations as clearly separated administrative fields. Verify charges and any free route on dated official pages. For alternative versions, document overlap and use sequential consideration where the journals prohibit concurrent submissions.

## Artifact pass

Validate DOCX ZIP members and XML structure; ensure captions, tables, images, and reference lists survive conversion. Open or render the file and inspect page images. Check first and last pages, every table and figure, page breaks, headings, hyperlinks, and code. Spot-check rendered numbers against the evidence ledger. Rebuild from another working directory to detect hidden path dependencies when the tooling is new.

## Completion record

Record each pass, concrete findings, revisions, automated commands, and remaining limitations. Use statuses such as passed, passed with stated limitation, or blocked on named external fact. A manuscript can be editorially polished while author metadata and eligibility remain unresolved. Do not call a manuscript submission-ready if an actual venue requirement remains unsatisfied. Do not invent an acceptance probability.
