import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
test('Cloudflare build entry and referenced modules are present', () => {
 assert.ok(existsSync('main.js'));
 assert.ok(existsSync('UI/App.js'));
 assert.match(readFileSync('index.html','utf8'), /src="\.\/main\.js"/);
});
