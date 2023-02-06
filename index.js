import fs from 'fs';
import path from 'path';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';

function createAsset(filePath) {
  // 1. 获取文件内容
  // ast -> 抽象语法树 

  const source = fs.readFileSync(filePath, {
    encoding: "utf-8",
  });

  // 2. 获取依赖关系

  const ast = parser.parse(source, {
    sourceType: "module"
  });

  const deps = [];

  traverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value);
    }
  })

  return {
    filePath,
    source,
    deps
  };
}

function createGraph() {
  const mainAsset = createAsset(path.resolve('./src', './main.js'));
  const queue = [mainAsset];

  for(const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const assetChild = createAsset(path.resolve('./src', relativePath));
      queue.push(assetChild);
    })
  }

  return queue;
}

console.log(createGraph());
