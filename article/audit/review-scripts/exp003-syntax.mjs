import fs from 'node:fs';
const rows=fs.readFileSync('evaluation/registry/exp-003-sft-lr1e-4/items/holdout.jsonl','utf8').trim().split('\n').map(JSON.parse);
const bal=(s)=>{let d=0;let q=null;for(let i=0;i<s.length;i++){const c=s[i];if(q){if(c==='\\'){i++;continue}if(c===q)q=null;continue}if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='(')d++;if(c===')')d--;}return d;};
const syn=rows.filter(r=>/missing \) after|Unexpected token|already been declared/.test(r.detail||''));
let unbalAssert=0, splice=0, unbalAny=0; const fams={};
for(const r of syn){const lines=r.completion.split('\n');
 const ub=lines.filter(l=>bal(l)!==0);
 const ubp=ub.filter(l=>/probe\(/.test(l));
 if(ub.length)unbalAny++;
 if(ubp.length)unbalAssert++;
 if(lines.some(l=>/Number\.isInteger\([^()]*\.every\(/.test(l)))splice++;
 const f=r.folder.split('/').slice(-2,-1)[0]; fams[f]=(fams[f]||0)+1;
}
console.log({syntax:syn.length,unbalAny,unbalAssert,spliceIsIntegerEvery:splice,fams});
const ex=syn.find(r=>r.completion.includes('slots.durations.every('));console.log(ex&&ex.item);
// scaffolding lines
let total=0,scaf=0;for(const r of rows){const body=r.completion.split('\n');total+=body.length;scaf+=body.filter(l=>/probe\(|const probe =|await \(async|^\}\)\(\);|const slots = \$slots/.test(l)).length}
console.log({total,scaf});
