import path, { dirname } from 'path';
import { webpack } from '../../lib/index.js';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const webpackConfig = {
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
};


webpack(webpackConfig);