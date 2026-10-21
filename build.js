import {cpSync,existsSync,mkdirSync,rmSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve,dirname,relative,extname} from 'node:path';
const root=process.cwd(),dist=resolve(root,'dist');
const required=['index.html','main.js','UI/App.js','Analysis/PitchDetector.js','Correction/PitchCorrectionEngine.js','Audio/AudioExporter.js','Workers/AudioWorker.js'];
for(const f of required)if(!existsSync(resolve(root,f)))throw Error('Missing required file: '+f);
const seen=new Set();function scan(file){const full=resolve(root,file);if(seen.has(full))return;seen.add(full);if(!existsSync(full))throw Error('Missing import: '+relative(root,full));const source=readFileSync(full,'utf8');for(const m of source.matchAll(/(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"](\.[^'"]+)['"]/g)){const target=resolve(dirname(full),m[1]);scan(target);}for(const m of source.matchAll(/new\s+URL\(\s*['"](\.[^'"]+)['"]\s*,\s*import\.meta\.url\s*\)/g))scan(resolve(dirname(full),m[1]));}
scan('main.js');scan('Workers/AudioWorker.js');
rmSync(dist,{recursive:true,force:true});mkdirSync(dist,{recursive:true});
for(const f of ['index.html','main.js','UI','Audio','Analysis','Correction','DSP','Editor','Project','Workers','Utils','Assets','public'])if(existsSync(resolve(root,f)))cpSync(resolve(root,f),resolve(dist,f),{recursive:true});
// Native ESM output: no external runtime dependencies; module paths stay relative.
console.log('Build passed: checked '+seen.size+' module paths; generated dist/.');
