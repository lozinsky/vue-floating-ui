#!/usr/bin/env node

'use strict';

const { spawnSync } = require('child_process');

const { setVueVersion, getNodeModule } = require('./vue-floating-ui-vue-demi');

/**
 * @returns {void}
 */
function main() {
  spawnSync('npx vue-demi-fix', {
    stdio: 'inherit',
    shell: true,
  });

  const Vue = getNodeModule('vue');

  if (!Vue || typeof Vue.version !== 'string') {
    console.warn('[vue-floating-ui-vue-demi] Vue is not found. Please run "npm install vue" to install.');
    return;
  }

  if (Vue.version.startsWith('2.7.')) {
    setVueVersion(2.7);
    return;
  }

  if (Vue.version.startsWith('2.')) {
    setVueVersion(2);
    return;
  }

  if (Vue.version.startsWith('3.')) {
    setVueVersion(3);
    return;
  }

  console.warn(`[vue-floating-ui-vue-demi] Vue version v${Vue.version} is not suppported.`);
}

main();
