import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const required = ['index.html','main.js','UI/App.js','UI/styles/main.css','Audio/AudioEngine.js','Audio/PlaybackEngine.js','package.json','vite.config.js'];
for (const file of required) {
  if (!existsSync(resolve(file))) throw new Error(`Missing required source file: ${file}`);
}
const entry = readFileSync('index.html','utf8');
if (!entry.includes('src="/main.js"')) throw new Error('HTML entry does not reference /main.js');
if (!readFileSync('main.js','utf8').includes("'./UI/App.js'")) throw new Error('Main entry does not import UI/App.js');
console.log('Source structure verified:', required.length, 'files');
