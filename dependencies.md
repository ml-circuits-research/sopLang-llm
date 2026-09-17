# Dependencies

## Runtime prerequisite

| Item | Detail |
| --- | --- |
| Required runtime | Node.js with stable ECMAScript module support and the `node --test` runner, executing code in `.mjs` files. |
| Purpose | Runs the SOP Lang parser, dependency analyzer, scheduler, transaction layer, context adapter, and data pipeline. |
| Startup check | The library and its scripts import only `node:` built-ins. A missing or older Node.js version fails at module load with a module-resolution or syntax error before any circuit work starts. |

## Third-party dependencies

The project has no third-party runtime dependencies. The library, its tests, and its scripts use Node.js built-ins only, including `node:test` and `node:assert/strict` for test organization. No npm package, Python interpreter, transpiler, bundler, or external test framework is required.

The `vision/` seed books are research material rather than executable dependencies. Their rights status is recorded per source in dataset manifests according to `docs/specs/DS008-training-data.md`.

The HTML documentation loads the Mermaid ES module from the jsDelivr CDN for diagram rendering in the browser:

| Item | Detail |
| --- | --- |
| Dependency | `mermaid@11` ESM build, loaded from `https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs`. |
| Scope | Documentation pages only. It is not part of the library. |
| Status | Required for diagram rendering in a browser; documentation text remains readable without it. |
| Alternatives considered | Static SVG files under `docs/assets/` were considered. Mermaid was selected because diagram definitions stay maintainable alongside the documentation pages and follow the documentation diagram rules. |
| License | MIT, as published by the Mermaid project. |
| Removal opportunity | Diagrams can be converted to static SVG assets and the CDN script removed from the HTML pages. |

## Environment-dependent tools used by experiments

Training and evaluation runs use accelerator, trainer, and inference tooling chosen per experiment. Those tools are dependencies of a run rather than of the repository, and each run manifest records the exact versions in use according to `docs/specs/DS009-fine-tuning-and-evaluation.md`.
