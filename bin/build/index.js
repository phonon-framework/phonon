// const JSBuilder = require('./js');
// const JSComponentsBuilder = require('./components');
const CSSBuilder = require('./css');

const args = process.argv.slice(2);

(async () => {
  /*
  if (args.indexOf('js') > -1) {
    const files = [
      {
        name: 'phonon',
        path: '../../src/js/phonon.js',
      },
      {
        name: 'phonon-spa',
        path: '../../src/js/phonon-spa.js',
      },
    ];

    // phonon packages
    await JSBuilder(files[0].name, files[0].path);

    // phonon SPA
    await JSBuilder(files[1].name, files[1].path);
  }

  if (args.indexOf('components') > -1) {
    // JS components
    await JSComponentsBuilder();
  }
  */

  if (args.indexOf('css') > -1) {
    await CSSBuilder();
  }
})();
