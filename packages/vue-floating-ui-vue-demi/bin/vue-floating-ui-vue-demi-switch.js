#!/usr/bin/env node

'use strict';

const { spawnSync } = require('child_process');

const { setVueVersion } = require('./vue-floating-ui-vue-demi');

/**
 * @returns {void}
 */
function main() {
  const version = process.argv[2];
  const entry = process.argv[3];

  spawnSync('npx vue-demi-switch', [version, entry], {
    stdio: 'inherit',
    shell: true,
  });

  if (version === '2.7') {
    setVueVersion(2.7);
    console.log('[vue-floating-ui-vue-demi] Switched for Vue 2.7');
    return;
  }

  if (version === '2') {
    setVueVersion(2);
    console.log('[vue-floating-ui-vue-demi] Switched for Vue 2');
    return;
  }

  if (version === '3') {
    setVueVersion(3);
    console.log('[vue-floating-ui-vue-demi] Switched for Vue 3');
    return;
  }

  console.warn(`[vue-floating-ui-vue-demi] expecting version "2" or "2.7" or "3" but got "${version}"`);
  process.exit(1);
}

main();
