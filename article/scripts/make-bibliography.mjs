import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const refs = {};
const yearOverrides = { runeson: 2009 };
for (const filename of await readdir(resolve(root, 'evidence/crossref'))) {
  if (!filename.endsWith('.json')) continue;
  const key = filename.slice(0, -5);
  const m = JSON.parse(await readFile(resolve(root, 'evidence/crossref', filename)));
  const year = yearOverrides[key] ?? m.published['date-parts'][0][0];
  const names = m.author.map(author => `${author.family}, ${author.given}`);
  const citation = `${m.author.length > 2 ? `${m.author[0].family} et al.`
    : m.author.map(author => author.family).join(' and ')}, ${year}`;
  const title = m.title[0] + (m.subtitle?.length ? ': ' + m.subtitle[0] : '');
  refs[key] = { citation, sort: `${m.author[0].family} ${year}`, doi: m.DOI,
    entry: `${names.join('; ')} (${year}). ${title}. *${m['container-title'][0]}*${m.volume ? `, ${m.volume}` : ''}${m.issue ? `(${m.issue})` : ''}${m.page ? `, ${m.page}` : ''}.`,
    title, year, authors: m.author, url: `https://doi.org/${m.DOI}`,
    metadataVerification: `Crossref DOI record, accessed 2026-09-28; ${key === 'runeson' ? '2009 journal issue year checked on publisher page; online-first date is 2008.' : 'title, authors, venue and year checked.'}` };
}
Object.assign(refs, {
  pal: { citation: 'Gao et al., 2023', sort: 'Gao 2023', year: 2023,
    title: 'PAL: Program-aided Language Models',
    entry: 'Gao, Luyu; Madaan, Aman; Zhou, Shuyan; Alon, Uri; Liu, Pengfei; Yang, Yiming; Callan, Jamie; Neubig, Graham (2023). PAL: Program-aided Language Models. *Proceedings of Machine Learning Research*, 202, 10764-10799.',
    url: 'https://proceedings.mlr.press/v202/gao23f.html', metadataVerification: 'Publisher page and BibTeX checked, 2026-09-28.' },
  pot: { citation: 'Chen et al., 2023', sort: 'Chen 2023', year: 2023,
    title: 'Program of Thoughts Prompting: Disentangling Computation from Reasoning for Numerical Reasoning Tasks',
    entry: 'Chen, Wenhu; Ma, Xueguang; Wang, Xinyi; Cohen, William W. (2023). Program of Thoughts Prompting: Disentangling Computation from Reasoning for Numerical Reasoning Tasks. *Transactions on Machine Learning Research*.',
    url: 'https://openreview.net/forum?id=YfZ4ZPt8zd', metadataVerification: 'Author preprint v4 and author code repository identify the TMLR 2023 publication; direct OpenReview access returned a browser challenge.' },
  scan: { citation: 'Lake and Baroni, 2018', sort: 'Lake 2018', year: 2018,
    title: 'Generalization without Systematicity: On the Compositional Skills of Sequence-to-Sequence Recurrent Networks',
    entry: 'Lake, Brenden; Baroni, Marco (2018). Generalization without Systematicity: On the Compositional Skills of Sequence-to-Sequence Recurrent Networks. *Proceedings of Machine Learning Research*, 80, 2873-2882.',
    url: 'https://proceedings.mlr.press/v80/lake18a.html', metadataVerification: 'Publisher page and BibTeX checked, 2026-09-28.' },
  llmcompiler: { citation: 'Kim et al., 2024', sort: 'Kim 2024', year: 2024,
    title: 'An LLM Compiler for Parallel Function Calling',
    entry: 'Kim, Sehoon; Moon, Suhong; Tabrizi, Ryan; Lee, Nicholas; Mahoney, Michael W.; Keutzer, Kurt; Gholami, Amir (2024). An LLM Compiler for Parallel Function Calling. *Proceedings of Machine Learning Research*, 235, 24370-24391.',
    url: 'https://proceedings.mlr.press/v235/kim24y.html', metadataVerification: 'Publisher page and BibTeX checked, 2026-09-28.' },
  z3: { citation: 'de Moura and Bjørner, 2008', sort: 'Moura 2008', year: 2008,
    title: 'Z3: An Efficient SMT Solver', doi: '10.1007/978-3-540-78800-3_24',
    entry: 'de Moura, Leonardo; Bjørner, Nikolaj (2008). Z3: An Efficient SMT Solver. *Tools and Algorithms for the Construction and Analysis of Systems*, Lecture Notes in Computer Science, 4963, 337-340.',
    url: 'https://www.microsoft.com/en-us/research/publication/z3-an-efficient-smt-solver/',
    metadataVerification: 'Author institution publication record and linked DOI checked, 2026-09-28.' }
});
const support = {
  pal: ['https://proceedings.mlr.press/v202/gao23f.html', 'Abstract, paragraphs 2-3', 'Natural-language problems can be translated into programs and solved by an external interpreter.', 'Does not validate SOP Lang or its small-model results.'],
  pot: ['https://arxiv.org/abs/2211.12588', 'Author version v4, abstract and introduction', 'Program-of-Thoughts delegates numerical computation to a program interpreter.', 'The published paper predates this project and is not a baseline evaluated here.'],
  dreamcoder: ['https://www.neurosymbolic.org/papers/EllisWNSMHCST21.pdf', 'PLDI version, introduction and overview', 'DreamCoder jointly learns reusable program libraries and neural search policies.', 'SOP Lang command design is an agent-assisted engineering loop, not a reproduction of its learning algorithm.'],
  scan: ['https://proceedings.mlr.press/v80/lake18a.html', 'Abstract', 'SCAN distinguishes limited recombination from more demanding systematic compositional generalization.', 'RNN findings do not establish a scaling law for modern code models.'],
  llmcompiler: ['https://proceedings.mlr.press/v235/kim24y.html', 'Abstract, architecture description', 'LLMCompiler separates planning, dispatch and execution of function calls.', 'Its reported speedups are not transferred to the present study.'],
  dwork: ['https://arxiv.org/abs/1506.02629', 'Companion author paper, abstract on adaptive holdout reuse', 'Repeated adaptive use of test results can overfit the holdout.', 'No numerical correction or reusable-holdout theorem is applied to the project.'],
  synthesis: ['https://eecs481.org/readings/Gulwani17.pdf', 'Introduction, specification/search-space/search-technique discussion', 'Program synthesis depends on the specification and the restricted space of programs.', 'An executable output is not proof that a natural-language specification was formalized correctly.'],
  sandve: ['https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1003285', 'Rules 1-5', 'Track provenance, script transformations, preserve versions and intermediate results.', 'The checklist is a reproducibility discipline, not a semantic oracle.'],
  runeson: ['https://doi.org/10.1007/s10664-008-9102-8', 'Abstract and case-study design/reporting sections', 'A software-engineering case study needs context, a chain of evidence, and explicit validity analysis.', 'A single case cannot estimate an agent error rate across populations.'],
  kapoor: ['https://reproducible.cs.princeton.edu/', 'Authors\' project page, scope and leakage explanation; paper linked there', 'Predictive evaluation can become overoptimistic through leakage and invalid separation of learning from testing.', 'The citation does not establish direct training contamination in this repository.'],
  messeri: ['https://www.crockettlab.org/s/MesseriCrockett_2024_Nature.pdf', 'Pages 49-50, introduction and Box 1', 'AI assistance can create misplaced confidence in understanding and narrow scientific inquiry.', 'The project does not measure cognitive illusions in human participants.'],
  raji: ['https://arxiv.org/abs/2001.00973', 'Introduction and sections 2-3, author full text', 'Auditing distributes documented checks over the AI development lifecycle and distinguishes reliability from accountability.', 'Local research auditing is an adaptation, not validation of the whole organizational framework.'],
  selbst: ['https://andrewselbst.com/wp-content/uploads/2019/10/selbst-et-al-fairness-and-abstraction-in-sociotechnical-systems.pdf', 'Introduction and discussion of abstraction traps', 'Technical abstraction can omit socially significant context and make a narrow formal target misleading.', 'A word-problem experiment is not a fairness deployment study.'],
  modelcards: ['https://arxiv.org/abs/1810.03993', 'Abstract and model-card reporting proposal', 'Model documentation should state identity, intended use, evaluation conditions and limitations.', 'A completed card alone does not validate performance claims.'],
  datasheets: ['https://arxiv.org/abs/1803.09010', 'Abstract of author version v8', 'Dataset documentation should identify motivation, composition, collection and recommended use.', 'Documenting provenance does not remove shared generator-oracle assumptions.'],
  cascades: ['https://research.google/pubs/everyone-wants-to-do-the-model-work-not-the-data-work-data-cascades-in-high-stakes-ai/', 'Abstract on data practices and downstream consequences', 'Data-quality problems can propagate through later stages of an AI workflow.', 'The present synthetic case does not reproduce the source\'s high-stakes field study.'],
  z3: ['https://www.microsoft.com/en-us/research/publication/z3-an-efficient-smt-solver/', 'Publication abstract', 'Z3 solves satisfiability modulo theories, including arithmetic and arrays.', 'No Z3 integration, speedup or accuracy improvement has been measured here.']
};
for (const [key, model, suffix] of [['qwen05', 'Qwen2.5-Coder-0.5B-Instruct', 'a'],
  ['qwen15', 'Qwen2.5-Coder-1.5B-Instruct', 'b'], ['qwen3', 'Qwen3-1.7B', 'c']]) {
  const url = `https://huggingface.co/Qwen/${model}`;
  refs[key] = { citation: `Qwen, n.d.-${suffix}`, sort: `Qwen ${suffix}`, title: model,
    entry: `Qwen. (n.d.-${suffix}). *${model}* [Model card]. Hugging Face. Retrieved September 28, 2026, from`,
    url, metadataVerification: 'Official model owner page, model name and publisher checked 2026-09-28; no unsupported publication date assigned.' };
  support[key] = [url, 'Model card title and model overview', 'Identifies the named released model and its owner.',
    'Experimental fine-tuning identity and results come from the local run manifests, not the upstream model card.'];
}
refs.artifact = { citation: 'SOP Lang research artifact, 2026', sort: 'SOP Lang research artifact 2026',
  title: 'SOP Lang research artifact: audited experiment records and reconstruction scripts', year: 2026,
  entry: '*SOP Lang research artifact: Audited experiment records and reconstruction scripts*. (2026). Supplementary material accompanying this manuscript; snapshot dated September 28, 2026. Public persistent identifier pending.',
  metadataVerification: 'Local companion artifact inspected; no public DOI or public availability asserted.' };
support.artifact = ['../README.md', 'Evidence inventory and source-hash manifest',
  'Locates the reconstruction scripts, derived tables, and original-input inventory used in the manuscripts.',
  'The local artifact is not an independently published dataset or a public archived release.'];

// Normalize verified author names to APA-style initials; preserve compound surnames.
function initials(given) {
  return given.trim().split(/\s+/).map(part => part.split('-')
    .map(word => word.match(/\p{L}/u)?.[0] + '.').join('-')).join(' ');
}
for (const ref of Object.values(refs)) {
  const match = /^(.+?) \((\d{4})\)\. /.exec(ref.entry);
  if (!match || !match[1].includes(',')) continue;
  const authors = match[1].split('; ').map(name => {
    if (name === 'III, Hal Daumé') return 'Daumé, H., III';
    const comma = name.indexOf(',');
    return `${name.slice(0, comma)}, ${initials(name.slice(comma + 1))}`;
  });
  const authorText = authors.length < 2 ? authors[0] : authors.slice(0, -1).join(', ') + ', & ' + authors.at(-1);
  ref.entry = ref.entry.replace(match[0], `${authorText} (${match[2]}). `);
  ref.citation = ref.citation.replace(' and ', ' & ');
}
const ledger = Object.entries(refs).map(([key, ref]) => ({ key, title: ref.title,
  metadata: ref.metadataVerification, accessed: '2026-09-28',
  supportUrl: support[key][0], locator: support[key][1],
  supports: support[key][2], doesNotEstablish: support[key][3],
  status: 'Primary-source support checked for the limited proposition recorded here.' }));
await writeFile(resolve(root, 'evidence/bibliography.json'), JSON.stringify(refs, null, 2) + '\n');
await writeFile(resolve(root, 'evidence/bibliography-audit.json'), JSON.stringify(ledger, null, 2) + '\n');
await writeFile(resolve(root, 'audit/bibliography.md'), '# Bibliography verification\n\nChecked 28 September 2026. Metadata and support were checked separately. The records below describe the supported propositions; they do not certify every possible use of a citation. Cached author PDFs are local reading material and are excluded from the delivery archive.\n\n'
  + ledger.map(row => `## ${row.key}: ${row.title}\n\n${row.metadata}\n\nSupport: ${row.supports} Source: [primary source](${row.supportUrl}), ${row.locator}.\n\nBoundary: ${row.doesNotEstablish}\n`).join('\n'));
console.log(`Wrote ${ledger.length} verified bibliography records.`);
