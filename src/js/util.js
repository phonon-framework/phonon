/*
 * Fix module resolution error with Typescript (for CommonJS components in dist/)
 * by creating util.js
 * Current fix is to add explicit .js extension in all components (accordion.ts, modal.ts, etc.)
 *
 * Resources:
 * https://www.typescriptlang.org/docs/handbook/module-resolution.html
 * https://github.com/Microsoft/TypeScript/issues/16577
 */

import utils from './utils';

export default utils;
