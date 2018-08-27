#!/usr/bin/env node

/**
 * Dynamic fake model generator
 * @desc node script to generate random models into CSV format; pipes to stout
 * @author Jason Seminara <js@ga.co>
 * @since 2018-08-23
 * @example ./generate -m models/tag --count=20 > demo_tags.csv
 */
const path = require('path');
const args = require('minimist')(process.argv.slice(2));

const [modelName, method] = (args.m || args.model).split('.');
const count = args.c || args.count;
const model = require(path.resolve(modelName));


function modelGenerator(m) {
  // loop over the keys to build out the heading
  const header = Object.keys(m).join(',');

  console.log(header);

  // loop over the values
  Array(count).fill(0)
    /* map over, execute the array of fns and join the results */
    .forEach(() => {
      console.log(Object.values(m).map(f => f()).join(','));
    });
}

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


// if we're outputting a CSV stream
if (args.out) {
  modelGenerator(model[method]());
} else {
  // if we're receiving a CSV data stream
  const stdin = process.openStdin();
  let data = '';

  stdin.on('data', (chunk) => { data += chunk; });

  stdin.on('end', () => {
    // we'll grab the head row and the rest of the data
    const [head, ...lines] = data.trim().split('\n');
    const keys = head.split(',');

    model[method](lines.map(r => zip(keys, r.split(','))))
      .then((results) => {
        console.log(results);
      })
      .catch(console.err);
  });
}

