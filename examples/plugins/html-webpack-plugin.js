import ejs from 'ejs';
import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

export default class HtmlWebpackPlugin {
  constructor(options) {
    const { filename, title } = options || {};
    this._filename = filename || 'index.html';
    this._title = title;
    
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('HtmlWebpackPlugin', (compilation, callback) => {

      const __dirname = dirname(fileURLToPath(import.meta.url));

      const template = fs.readFileSync(  
        path.resolve(__dirname, './htmlTemplate.ejs'), {
        encoding: 'utf-8',
      });

      const outputPath = path.join(compilation._output.path, this._filename);
      const code = ejs.render(template, { 
        data: {
          title: this._title,
          outputFilename: compilation._output.filename,
        }
    });
      fs.writeFileSync(outputPath, code);

      callback();
    })
  }
}