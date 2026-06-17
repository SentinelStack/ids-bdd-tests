// Compat shim pentru extensia „Playwright Test for VSCode".
//
// playwright-bdd alege calea modulului intern de config în funcție de versiunea
// @playwright/test pe care o vede:
//   PW >= 1.60  ->  playwright/lib/common/index.js  (.configLoader)
//   PW <  1.60  ->  playwright/lib/common/configLoader.js
// CLI-ul vede corect 1.61 și ia prima cale. Extensia VS Code rulează însă într-un
// context în care nu citește versiunea (o vede goală/veche) și cade pe a doua cale,
// care nu mai există în Playwright >= 1.60 -> „Cannot find module .../configLoader.js".
//
// Scriptul recreează configLoader.js ca un mic re-export din index.js, deci AMBELE
// căi funcționează. Rulează automat după `npm install` (hook `postinstall`).

import { existsSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

try {
  const root = path.dirname(require.resolve('playwright/package.json'));
  const indexPath = path.join(root, 'lib', 'common', 'index.js');
  const shimPath = path.join(root, 'lib', 'common', 'configLoader.js');

  if (!existsSync(indexPath)) {
    console.log('[ensure-pw-compat] playwright/lib/common/index.js lipsește — sar (Playwright < 1.60?).');
  } else if (existsSync(shimPath)) {
    console.log('[ensure-pw-compat] configLoader.js există deja — nimic de făcut.');
  } else {
    writeFileSync(shimPath, "module.exports = require('./index.js').configLoader;\n");
    console.log('[ensure-pw-compat] am scris shim-ul configLoader.js (compat extensie VS Code).');
  }
} catch (err) {
  console.log('[ensure-pw-compat] sărit:', err.message);
}
