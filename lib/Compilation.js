import { parse } from './parse.js';
import path from 'path';
import fs from 'fs';

let ID = 0;
export class Compilation {
  constructor({ loaders, entry, output }) {
    this._loaders = loaders;
    this._entry = entry;
    this._output = output,
    this.graph = [];
  } 

  buildModule(filename) {
    let sourceCode = fs.readFileSync(filename, { encoding: "utf-8" });

    this._loaders.forEach(loader => {
      const { test, use } = loader;

      const loaderContext = {
        addDeps(dep) {
          console.log('addDeps', dep);
        },
      }

      if(test.test(filename)) {
        if(Array.isArray(use)) {
          use.traverse().forEach((fn) => {
            sourceCode = fn.call(loaderContext, sourceCode);
          })
        } else {
          sourceCode = use.call(loaderContext, sourceCode);
        }
      }
    });

    const { dependenciesPaths, code } = parse(sourceCode);

    return {
      code,
      dependenciesPaths,
      filename,
      mapping: {},
      id: ID++
    }
  }

  make() {
    const moduleQueue = [];
    const entryModule = this.buildModule(this._entry);
    moduleQueue.push(entryModule);

    for(let i = 0; i < moduleQueue.length; i++) {
      const module = moduleQueue[i];

      // 假如 module.dependenciesPaths的值为[], 则跳过forEach内函数体的执行.
      module.dependenciesPaths.forEach((dependencyPath) => {
        const childPath = path.resolve(path.dirname(entryModule.filename), dependencyPath);
        const childModule = this.buildModule(childPath);
        module.mapping[dependencyPath] = childModule.id;
        moduleQueue.push(childModule);
      })
    }

    this.graph = moduleQueue;
  }
}
