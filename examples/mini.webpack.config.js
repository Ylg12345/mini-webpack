import path, { dirname } from 'path';
import { webpack } from '../lib/index.js';
import { fileURLToPath } from 'url';
import { jsonLoader } from './loader/json-loader.js';
import HtmlWebpackPlugin from './plugins/html-webpack-plugin.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const webpackConfig = {
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        // use 支持单个函数, 也可支持数组, 如 [f2-loader, f1-loader]
        use: jsonLoader,
        test: /\.json$/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'template.html',
      // title: 'mini-webpack-ylg'
    }),
  ]
};

webpack(webpackConfig);