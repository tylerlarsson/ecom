const fs = require('fs');
const path = require('path');
const SEPARATOR = path.sep;

const p = __filename.split(SEPARATOR);
p.length -= 2;
const BASE_PATH = p.join(SEPARATOR) + SEPARATOR;

function readFile(...relativePath) {
  const file = BASE_PATH + relativePath.join(path.sep);
  return fs.readFileSync(file, 'utf8').toString();
}

function readJson(...relativePath) {
  return JSON.parse(readFile(...relativePath));
}

module.exports = {
  readFile,
  readJson,
  BASE_PATH,
};
