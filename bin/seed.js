#!/usr/bin/env node
const path = require('path');

const args  = require('minimist')(process.argv.slice(2));

const model = args.m || args.model;

const { insertBatch } = require(path.resolve(model));

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

  insertBatch(lines.map(r => zip(keys, r.split(','))))
    .then((results) => {
      console.log(results);
    })
    .catch(console.err);
});
