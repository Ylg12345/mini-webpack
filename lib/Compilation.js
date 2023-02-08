import { parse } from './parse.js';
import path from 'path';
import fs from 'fs';

let ID = 0;
export class Compilation {
  constructor({ loaders, entry }) {
    this._loaders = loaders;
    this._entry = entry;
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

  mark() {
    const moduleQueue = [];
    const entryModule = this.buildModule(this._entry);
    moduleQueue.push(entryModule);

    let i = 0;
    while(i < moduleQueue.length) {
      const currentModule = moduleQueue[i];
      entryModule.dependenciesPaths.forEach((dependencyPath) => {
        const childPath = path.resolve(path.dirname(entryModule.filename), dependencyPath);
        const childModule = this.buildModule(childPath);
        currentModule.mapping[childPath] = childModule.id;
        moduleQueue.push(childModule);
      });
      i++;
    }

    this.graph = moduleQueue;
  }

}
