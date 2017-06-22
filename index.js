/* eslint-disable no-console */
const path = require('path');

let TsPreprocessor;
try {
  TsPreprocessor = require('./lib/typescript-preprocessor'); // eslint-disable-line global-require
} catch (ex) {
  // Do nothing; we just won't have the plugin available. This means that if you
  // somehow end up in a state where it doesn't load, the preprocessor *will*
  // fail, but this is necessary because the preprocessor depends on packages
  // which aren't installed until the
}

module.exports = {
  name: 'ember-cli-typescript',

  included(app, ...args) {
    this._super.included.apply(this, ...args);
    this.app = app;
  },

  blueprintsPath() {
    return path.join(__dirname, 'blueprints');
  },

  setupPreprocessorRegistry(type, registry) {
    if (!TsPreprocessor) {
      console.log(
        'Note: TypeScript preprocessor not available -- some dependencies not installed.\n' +
          '\t(If this is during installation of the add-on, this is as expected. If it is\n' +
          '\twhile building, serving, or testing the application, this is an error.)'
      );
      return;
    }

    try {
      const plugin = new TsPreprocessor({ includeExtensions: ['.ts', '.js'] });
      registry.add('js', plugin);
    } catch (ex) {
      console.log(
        'Missing or invalid tsconfig.json!\n' +
          '\tPlease add a tsconfig.json file or run `ember generate ember-cli-typescript`.'
      );
      console.log(`  ${ex.toString()}`);
    }
  },
};
