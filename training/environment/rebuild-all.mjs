// Rebuild the whole training-data tree from the declared sources.
// Lives in the repository (not /tmp) so a machine reset cannot lose the runbook's
// rebuild step. Usage: node training/environment/rebuild-all.mjs
import { runPilot } from '/home/salboaie/work/sopLang-llm/teacher/pilot.mjs';
import { SOURCES } from '/home/salboaie/work/sopLang-llm/teacher/sources/index.mjs';
for (const source of SOURCES) {
  const started = Date.now();
  try {
    const result = await runPilot({ book: source.id, write: true, verbose: false });
    console.log(`${source.id}: accepted ${result.accepted?.length} rejected ${result.rejected?.length} in ${((Date.now()-started)/1000).toFixed(1)}s`);
  } catch (error) {
    console.log(`${source.id}: FAILED ${String(error).slice(0, 160)}`);
  }
}
