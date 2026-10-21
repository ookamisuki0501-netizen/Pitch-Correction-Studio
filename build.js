import {cpSync,mkdirSync,rmSync,existsSync,readFileSync} from 'node:fs';
const files=['index.html','main.js','styles.css','yin.js','pitch-shift.js','wav.js','audio.js','graphs.js','processor.js'];
for(const f of files){if(!existsSync(f))throw Error('Missing required file: '+f)}
for(const f of files.filter(f=>f.endsWith('.js')&&f!=='processor.js')){const src=readFileSync(f,'utf8');for(const m of src.matchAll(/from\s+['"]\.\/(.+?)['"]/g)){if(!existsSync(m[1]))throw Error(`${f}: missing import ${m[1]}`)}}
rmSync('dist',{recursive:true,force:true});mkdirSync('dist');for(const f of files)cpSync(f,'dist/'+f);console.log('Build complete: dist/ ('+files.length+' files)');
