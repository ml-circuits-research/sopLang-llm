# Machine Learning contribution information sheet

Manuscript: Choosing the language a small model must learn: executable abstractions in program compilation

## 1. Main claim and significance

The executable target language changes the work a small model must learn to perform. A specialized command can remove algorithm construction from the generated program; splitting the same computation into more components can instead add interfaces that must be coordinated. This distinction motivates studying abstraction level as an experimental variable rather than equating modularity with easier learning.

The archive supplies a positive developmental signal and a counterexample to unconditional decomposition. It does not establish a general learning law, a new synthesis algorithm, a universal size threshold, or automatic library discovery. The paper turns the observed contrast into a prospective, controlled design for discovering useful commands.

## 2. Evidence

Experiment A compares the same Qwen2.5-Coder-1.5B base with general-code and specialized-command curricula. Overall normalized exact matching rises from 53.8% to 62.4% on 705 problems; procedural execution failures fall from 13.1% to 2.7% on 480 problems. The retained identifiers and reference answers match within the pair. One run per condition and a missing early training manifest limit causal attribution. Only 8.3% of procedural outputs directly declare an added command, so direct command use cannot by itself account for the 13.1-percentage-point procedural match gain.

Experiment B compares compact and split targets for Qwen3-1.7B on another paired set of 705 problems. Exact matching falls from 65.2% to 63.5%, while execution failures rise from 8.1% to 19.1%. Syntax and dependency-graph acceptance remain perfect. The proposed explanation is greater coordination burden; the paper does not claim a causal classification of every error.

Experiment C compares adapted 0.5B and 1.7B systems on the same later evaluation population. Overall matching rises from 51.2% to 59.7%, while some task families worsen. Model family and pretrained state differ along with size, so this is a system comparison rather than controlled scaling.

Separate base-to-adapted reference comparisons use 585 paired problems per model and apply both retained scorers to both outputs. Historical content-check acceptance rises from 10.8% to 44.4% for Qwen2.5-Coder-0.5B and from 5.1% to 61.4% for Qwen2.5-Coder-1.5B. This scorer is a weak diagnostic, not semantic accuracy. Exact comparison is reported alongside it. Fine-tuning, prompting, execution, and token caps change together, so these observations support the full workflow rather than isolating its components.

## 3. Closest contributions and relation

Gao and colleagues' *PAL: Program-aided Language Models* establishes computation delegation to an interpreter (PMLR 202, 2023, 10764–10799). Chen and colleagues' *Program of Thoughts Prompting* also separates computation from language-model reasoning (TMLR, 2023). Our study varies the executable vocabulary learned by a small fine-tuned student; it does not offer a matched superiority comparison with those systems.

Ellis and colleagues' *DreamCoder: bootstrapping inductive program synthesis with wake-sleep library learning* learns reusable libraries and synthesis policies (PLDI, 2021, https://doi.org/10.1145/3453483.3454080). Our commands were engineered with agent assistance; automatic discovery is a future research question. Lake and Baroni's *Generalization without Systematicity* motivates separating familiar instances from structural transfer (PMLR 80, 2018, 2873–2882). The planned sealed transfer set addresses a limitation of the repeatedly inspected development benchmark.

## 4. Prior publication and related manuscripts

Prior publication or preprint status requires author confirmation. Five journal-specific manuscripts have been prepared from the same experimental programme. This version centers the learning target; the others center language contracts, research-software auditing, task-family evaluation, or epistemic responsibility. Their shared evidence requires disclosure. They are currently alternative submission routes, without any assertion of exclusive submission or previously unpublished status on the authors' behalf.
