/**
 * Babel Starter Kit (https://www.kriasoft.com/babel-starter-kit)
 *
 * Copyright © 2015-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs');
const del = require('del');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const pkg = require('../package.json');
const browserify = require('browserify');

let promise = Promise.resolve();

// Clean up the output directory
promise = promise.then(() => del(['dist/*']));

// Compile source code into a distributable format with Babel
['es', 'cjs', 'umd'].forEach((format) => {
  promise = promise.then(() => rollup.rollup({
    entry: 'src/index.js',
    external: Object.keys(pkg.dependencies),
    plugins: [babel(Object.assign(pkg.babel, {
      babelrc: false,
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      presets: pkg.babel.presets.map(x => (x === 'latest' ? ['latest', { es2015: { modules: false } }] : x)),
    }))],
  }).then(bundle => bundle.write({
    dest: `dist/${format === 'cjs' ? 'index' : `index.${format}`}.js`,
    format,
    sourceMap: true,
    useStrict: false,
    moduleName: format === 'umd' ? pkg.name : undefined,
  })));
});

// Copy package.json and LICENSE.txt
promise = promise.then(() => {
  delete pkg.private;
  delete pkg.devDependencies;
  delete pkg.scripts;
  delete pkg.eslintConfig;
  delete pkg.babel;
  var browserifyInstance = browserify('dist/index.js');
  browserifyInstance.bundle(function (err, buf) {
    if (err) {
      throw new Error(err)
    } else {
      fs.writeFileSync('dist/index.out.js', buf, 'utf-8');
    }
  }).on('data', function() {});

  fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, '  '), 'utf-8');
  fs.writeFileSync('dist/LICENSE.txt', fs.readFileSync('LICENSE.txt', 'utf-8'), 'utf-8');
  fs.writeFileSync('dist/octicons.lt-ie8.css', fs.readFileSync('resources/assets/css/octicons/lt-ie8.css', 'utf-8'), 'utf-8');
  fs.writeFileSync('dist/octicons.sizes.css', fs.readFileSync('resources/assets/css/octicons/sizes.css', 'utf-8'), 'utf-8');
  fs.writeFileSync('dist/octicons.woff2', fs.readFileSync('resources/assets/css/octicons/octicons.woff2'));
  fs.writeFileSync('dist/octicons.woff', fs.readFileSync('resources/assets/css/octicons/octicons.woff'));
  fs.writeFileSync('dist/octicons.ttf', fs.readFileSync('resources/assets/css/octicons/octicons.ttf' ));
  fs.writeFileSync('dist/octicons.min.css', fs.readFileSync('resources/assets/css/octicons/octicons.min.css', 'utf-8'), 'utf-8');
  fs.writeFileSync('dist/buttons.css', fs.readFileSync('resources/assets/css/buttons.css', 'utf-8'), 'utf-8');
  fs.writeFileSync('dist/buttons.css.map', fs.readFileSync('resources/assets/css/buttons.css.map', 'utf-8'), 'utf-8');
  fs.writeFileSync('dist/index.html', fs.readFileSync('resources/index.html', 'utf-8'), 'utf-8');
  fs.writeFileSync('dist/buttons.html', fs.readFileSync('resources/buttons.html', 'utf-8'), 'utf-8');
});

promise.catch(err => console.error(err.stack)); // eslint-disable-line no-console
