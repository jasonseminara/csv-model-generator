#!/usr/bin/env node --inspect-brk
const model = require('../model/User');

const stdin = process.openStdin();
let data = '';

/**
 * @func zip
 * @param {string[]} an array of strings that will become keys
 * @param {array} an array that will become the values
 */
function zip(keys, vals) {
  return vals.reduce((obj, val, i) => ({
    ...obj,
    [keys[i]]: val,
  }), {});
}


stdin.on('data', (chunk) => { data += chunk; });

stdin.on('end', () => {
  // we'll grab the head row and the rest of the data
  const [head, ...lines] = data.trim().split('\n');
  const keys = head.split(',');

  model.insertBatch(lines.map(r => zip(keys, r.split(','))))
    .then((results) => {
      debugger;
      console.log(results);
    })
    .catch(console.err);
});
