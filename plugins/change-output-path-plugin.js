export default class ChangeOutputPathPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(hooks) {
    hooks.emitFile.tap('ChangeOutputPathPlugin', (context) => {
      context.changeOutputPath(this.options.outpath);
    })
  }
}