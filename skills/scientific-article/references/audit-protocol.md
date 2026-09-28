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

## Argument pass

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
