const typescript = require('rollup-plugin-typescript2');
const path = require('path');
const rollup = require('rollup');
const fs = require('fs');
const UglifyJS = require('uglify-js');
const banner = require('./banner');

const rootPath = '../..';
const plugins = [
  typescript(),
];

// Components
const components = {
  Accordion: path.resolve(__dirname, `${rootPath}/src/js/components/accordion.ts`),
  Alert: path.resolve(__dirname, `${rootPath}/src/js/components/alert.ts`),
  Collapse: path.resolve(__dirname, `${rootPath}/src/js/components/collapse.ts`),
  Loader: path.resolve(__dirname, `${rootPath}/src/js/components/loader.ts`),
  Modal: path.resolve(__dirname, `${rootPath}/src/js/components/modal.ts`),
  ModalConfirm: path.resolve(__dirname, `${rootPath}/src/js/components/modal-confirm.ts`),
  ModalLoader: path.resolve(__dirname, `${rootPath}/src/js/components/modal-loader.ts`),
  ModalPrompt: path.resolve(__dirname, `${rootPath}/src/js/components/modal-prompt.ts`),
  Notification: path.resolve(__dirname, `${rootPath}/src/js/components/notification.ts`),
  Offcanvas: path.resolve(__dirname, `${rootPath}/src/js/components/offcanvas.ts`),
  Selectbox: path.resolve(__dirname, `${rootPath}/src/js/components/selectbox.ts`),
  Tab: path.resolve(__dirname, `${rootPath}/src/js/components/tab.ts`),
  // Fix
  Util: path.resolve(__dirname, `${rootPath}/src/js/util.js`),
};

async function build(component) {
  console.log(`Building ${component} component...`);

  try {
    const componentFilename = component.toLowerCase();
    const componentPath = component === 'Util' ? '' : '/components';
    const file = path.resolve(__dirname, `${rootPath}/dist/js${componentPath}/${componentFilename}.js`);
    const fileMin = path.resolve(__dirname, `${rootPath}/dist/js${componentPath}/${componentFilename}.min.js`);
    const external = [];
    const globals = {};

    // do not bundle Util in plugins
    if (component !== 'Util') {
      external.push(components.Util);
      globals[components.Util] = 'Util';
    }

    const bundle = await rollup.rollup({
      input: components[component],
      plugins,
      external,
    });

    await bundle.write({
      banner: banner(component),
      format: 'cjs',
      file,
      name: component,
      sourcemap: true,
      globals,
    });

    // minify component
    const result = UglifyJS.minify(fs.readFileSync(file, 'utf8'), {
      sourceMap: {
        filename: fileMin,
        url: `${fileMin}.map`,
      },
    });

    if (result.error) throw result.error;

    fs.writeFileSync(fileMin, result.code, 'utf8');
  } catch(err) {
    console.error(`${component}: ${err}`);
    console.trace(err);
  }
}

Object.keys(components).forEach(component => build(component));
