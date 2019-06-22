const pkg = require('../../package.json');
const year = new Date().getFullYear();

function getBanner(name = 'Phonon') {
  return `/*!
  * ${name} v${pkg.version} (${pkg.homepage})
  * Copyright 2015-${year} ${pkg.author}
  * Licensed under MIT (https://github.com/phonon-framework/phonon/blob/master/LICENSE.md)
  */`;
}

module.exports = getBanner;
