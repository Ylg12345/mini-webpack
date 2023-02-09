import fs from 'fs';
import path from 'path';
import { AsyncSeriesHook, SyncHook } from 'tapable';
import { Compilation } from './compilation.js';
import { generateBundle } from './generateBundle.js';

export class Compiler {

  constructor(config) {
    const { entry, output, plugins, module } = config;

    this._config = config;
    this._entry = entry;
    this._output = output;
    this._plugins = plugins || [];

    this.compilation = null;
    this.hooks = {
      run: new AsyncSeriesHook(['compiler']),
      compilation: new SyncHook(['compilation']),
      emit: new AsyncSeriesHook(['compilation']),
    }

    this.initPlugins();
  }

  initPlugins() {
    this._plugins.forEach((plugin) => {
      plugin?.apply(this);
    })
  }

  run() {

    // run hook 调用
    this.hooks.run.callAsync(this, () => {
      console.log("run");
    });

    this.compilation = new Compilation({
      entry: this._entry,
      loaders: this._config.module?.rules || [],
      output: this._output,
    })

    this.compilation.make();
    
    // compilation hook 调用
    this.hooks.compilation.call(this.compilation, () => {
      console.log("compilation");
    });

    // emit hook 调用
    this.hooks.emit.callAsync(this.compilation, () => {
      console.log("emit");
    });
    
    this.emitFiles();
  }

  emitFiles() {
    const outputPath = path.join(this._output.path, this._output.filename);

    const modules = this.compilation.graph.reduce((pre, cur) => {
      pre[cur.id] = {
        code: cur.code,
        mapping: cur.mapping,
      }

      return pre;
    }, {});

    const code = generateBundle({ modules });
    fs.writeFileSync(outputPath, code);
  }

}