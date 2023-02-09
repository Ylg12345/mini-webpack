import ejs from 'ejs';
import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateHtml } from '../../lib/generateBundle.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default class HtmlWebpackPlugin {
  constructor(options) {
    const { filename, title } = options || {};
    this._filename = filename || 'index.html';
    this._title = title;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('HtmlWebpackPlugin', (compilation, callback) => {
      const templatePath = path.resolve(__dirname, './htmlTemplate.ejs');
      const outputPath = path.join(compilation._output.path, this._filename);
      const htmlOptions = {
        title: this._title,
        outputFilename: compilation._output.filename,
      };

      generateHtml({ htmlOptions, outputPath, templatePath })
      callback();
    })
  }
}