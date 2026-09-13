import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => readFile(path.join(root, name), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const [html, sketch, jsconfig] = await Promise.all([read('index.html'), read('sketch.js'), read('jsconfig.json')]);

assert(/<html[^>]+lang=["']en["']/i.test(html), 'index.html must declare English content.');
assert(/<script[^>]+src=["']https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/p5\.js\/1\.11\.1\/p5\.min\.js["']/i.test(html), 'index.html must load the pinned p5.js CDN asset.');
assert(/integrity=["']sha512-265OeMthg1wxVfU0mpNMtNrz2E\+OKxJ9CNbmv\+oYCxNO93Lgmxq9pwqubnQqkSJgzvsqLju8Mr106tcMlwsZxg==["']/i.test(html), 'The p5.js CDN script must use its published SRI hash.');
assert(/crossorigin=["']anonymous["']/i.test(html), 'The CDN script must use anonymous CORS for SRI.');
assert(!/libraries\/p5(?:\.sound)?\.min\.js/i.test(html), 'index.html must not reference missing local p5 library files.');
assert(/<script[^>]+src=["']sketch\.js["']/i.test(html), 'index.html must load sketch.js.');
assert(/createCanvas\(600,\s*400\)\.parent\(["']sketch-container["']\)/.test(sketch), 'The sketch canvas must be attached to the documented sketch container.');
assert(!/[A-Za-z]:\\\\|\/Users\//.test(jsconfig), 'jsconfig.json must not contain a machine-specific absolute path.');
JSON.parse(jsconfig);

const syntax = spawnSync(process.execPath, ['--check', 'sketch.js'], { cwd: root, encoding: 'utf8' });
assert(syntax.status === 0, `sketch.js syntax check failed:\n${syntax.stderr}`);

const clickSandbox = {
  createCanvas: () => ({ parent: () => {} }),
  dist: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
  width: 600,
  height: 400,
  mouseX: 0,
  mouseY: 0,
};
vm.runInNewContext(
  `${sketch}\nglobalThis.__clickTestApi = { setup, mousePressed, state: () => ({ ballX, ballY, ballSpeedX, ballSpeedY, ballSelected }) };`,
  clickSandbox,
);
clickSandbox.__clickTestApi.setup();
clickSandbox.mouseX = 300;
clickSandbox.mouseY = 200;
clickSandbox.__clickTestApi.mousePressed();
assert(clickSandbox.__clickTestApi.state().ballSelected, 'Clicking the stationary ball must select it before targeting.');
assert(clickSandbox.__clickTestApi.state().ballSpeedX === 0 && clickSandbox.__clickTestApi.state().ballSpeedY === 0, 'Selecting the ball must not launch it.');
clickSandbox.mouseX = 400;
clickSandbox.mouseY = 250;
clickSandbox.__clickTestApi.mousePressed();
const launched = clickSandbox.__clickTestApi.state();
assert(!launched.ballSelected, 'Choosing a target must clear the ball selection.');
assert(launched.ballSpeedX === 20 && launched.ballSpeedY === 10, 'The target click must set velocity toward the selected target.');

console.log('Static validation passed.');
