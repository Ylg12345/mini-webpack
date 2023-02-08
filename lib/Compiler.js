import fs from 'fs';
import path from 'path';
import { AsyncSeriesBailHook, SyncHook } from 'tapable';
import { Compilation } from './Compilation.js';

export class Compiler {

  constructor(config) {
    const { entry, output, plugins, module } = config;

    this._config = config;
    this._entry = entry;
    this._output = output;
    this._plugins = plugins || [];

    this._graph = [];
    this._compilation = null;

    this.hooks = {
      run: new AsyncSeriesHook(['compiler']),
      compilation: new SyncHook(['compilation']),
      emit: new AsyncSeriesHook(['compilation']),
    }

    this.initPlugins();

  }

  initPlugins() {
    const _slef = this;

    _slef._plugins.forEach((plugin) => {
      plugin.apply?.call(_slef, plugin);
    })
  }

  run() {
    const _slef = this;

    this.hooks.run.callAsync(_slef, () => {
      console.log("run");
    });

    this._compilation = new Compilation({
      entry: this._entry,
      loaders: this._config.module?.rules || [],
    })

    this.hooks.compilation.call(this._compilation, () => {
      console.log("compilation");
    });

    this._compilation.make();

    this.hooks.emit.callAsync(this._compilation, () => {
      console.log("emit");
    });
    
    this.emitFiles();
  }

  emitFiles() {

  }

}