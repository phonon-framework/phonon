const pkg = require('../../package.json');
const year = new Date().getFullYear();

function getBanner(name = 'Phonon') {
  return `/*!
  * ${name} v${pkg.version} (${pkg.homepage})
  * Copyright 2015-${year} ${pkg.author}
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */`;
}

module.exports = getBanner;
