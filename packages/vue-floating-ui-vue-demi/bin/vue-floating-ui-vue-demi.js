'use strict';

const path = require('path');
const fs = require('fs');

const lib = path.join(__dirname, '../lib/');

/**
 * @param {number} version
 *
 * @returns {void}
 */
exports.setVueVersion = function setVersion(version) {
  const entry = path.join(lib, `v${version}`);

  for (const file of fs.readdirSync(entry)) {
    fs.copyFileSync(path.join(entry, file), path.join(lib, file));
  }
};

/**
 * @param {string} name
 *
 * @returns {unknown}
 */
exports.getNodeModule = function getModule(name) {
  try {
    return require(name);
  } catch {
    return undefined;
  }
};
