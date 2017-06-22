const path = require('path');

const debug = require('debug')('ember-cli-typescript');
const funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const typescript = require('typescript');
const typescriptCompiler = require('broccoli-typescript-compiler').typescript;

function readConfig(configFile) {
  const result = typescript.readConfigFile(configFile, typescript.sys.readFile);
  if (result.error) {
    const message = typescript.flattenDiagnosticMessageText(result.error.messageText, '\n');
    throw new Error(message);
  }
  return result.config;
}

// TsConfig -> TsConfig
const updateTsConfigForBroccoli = tsConfig =>
  Object.assign({}, tsConfig, {
    // The `include` setting is meant for the IDE integration; broccoli manages
    // manages its own input files.
    include: ['**/*.ts'],

    // tsc needs to emit files on the broccoli pipeline, but not in the default
    // config. Otherwise its compiled `.js` files may be created inadvertently.
    outDir: undefined,
    noEmit: false,
  });

const tsFilesFrom = treeOrNode =>
  funnel(treeOrNode, {
    include: [/ts$/],
    annotation: 'TS files',
  });

const jsFilesFrom = treeOrNode =>
  funnel(treeOrNode, {
    include: [/js$/],
    annotation: 'JS files',
  });

const compiledTs = (tsTree, tsConfig) =>
  typescriptCompiler(tsTree, {
    tsConfig,
    annotation: 'compiled TS files',
  });

class TypeScriptPreprocessor {
  constructor(options) {
    debug('creating new instance with options ', options);
    this.name = 'ember-cli-typescript';
    this.ext = 'ts';
    this.options = JSON.parse(JSON.stringify(options));
  }

  // eslint-disable-next-line class-methods-use-this
  toTree(inputNode /* , inputPath, outputPath*/) {
    const packageTsConfig = readConfig(path.join('.', 'tsconfig.json'));
    const tsConfig = updateTsConfigForBroccoli(packageTsConfig);

    const tsFiles = tsFilesFrom(inputNode);

    const ts = compiledTs(tsFiles, tsConfig);
    const js = jsFilesFrom(inputNode);

    return mergeTrees([ts, js], { annotation: 'merged TS and JS files' });
  }
}

module.exports = TypeScriptPreprocessor;
