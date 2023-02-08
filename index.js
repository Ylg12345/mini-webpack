import fs from 'fs';
import path from 'path';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import ejs from 'ejs';
import { transformFromAst } from 'babel-core';
import jsonLoader from './loader/json-loader.js'; 
import ChangeOutputPathPlugin from './plugins/change-output-path-plugin.js';
import { SyncHook } from 'tapable';

let id = 0;

const webpackOptions = {
  module: {
    rules: [
      {
        test: /\.json$/,
        use: [
          jsonLoader
        ]
      },
    ],
  },
  plugins: [
    new ChangeOutputPathPlugin({
      outpath: './dist/index.js'
    })
  ]
}

const hooks = {
  emitFile: new SyncHook(['context']), 
};

function createAsset(filePath) {
  // 获取文件内容
  // ast -> 抽象语法树 

  let source = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });

  // init loader

  const loaderContext = {
    addDeps(dep) {
      console.log('addDeps', dep);
    },
  }

  const loaders = webpackOptions.module.rules;

  loaders.forEach(({ test, use }) => {
    if(test.test(filePath)) {
      if(Array.isArray(use)) {
        use.reverse().forEach((fn) => {
          source = fn.call(loaderContext, source)
        })
      } else {
        source = use.call(loaderContext, source);
      }
    }
  })

  // 获取依赖关系

  const ast = parser.parse(source, {
    sourceType: 'module'
  });

  const deps = [];

  traverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value);
    }
  })
  
  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  })

  return {
    filePath,
    deps,
    code,
    mapping: {},
    id: id++
  };
}

// init plugins

function initPlugins() {
  const plugins = webpackOptions.plugins;
  plugins.forEach((plugin) => {
    plugin.apply(hooks);
  })
}

initPlugins();

function createGraph() {
  const mainAsset = createAsset(path.resolve('./src', './main.js'));
  const queue = [mainAsset];

  for(const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const assetChild = createAsset(path.resolve('./src', relativePath));
      asset.mapping[relativePath] = assetChild.id;
      queue.push(assetChild);
    })
  }

  return queue;
}

function build(graph) {
  const template = fs.readFileSync('./bundle.ejs', { 
    encoding: 'utf-8'
  })

  const data = graph.map((asset) => {
    const { id, code, mapping } = asset;
    return {
      id,
      code,
      mapping
    }
  });

  let outputPath = './dist/bundle.js';

  hooks.emitFile.call({
    changeOutputPath(path) {
      outputPath = path;
    },
  });

  const code = ejs.render(template, { data });
  fs.writeFileSync(outputPath, code);
}

const graph = createGraph();

build(graph);

