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

const { m, count } = args;

const model = require(path.resolve(m)).fake();

const modelGenerator = (model) => {
  // loop over the keys to build out the heading
  const header = Object.keys(model).join(',');

  // loop over the values
  const body = Array(count).fill(0)
    /* map over, execute the array of fns and join the results */
    .map(() => Object.values(model).map(f => f()).join(','));

  // join the header and the body
  // spit out the results with line breaks separating the records
  return [header, ...body].join('\n');
};


console.log(modelGenerator(model));
