import ejs from 'ejs';
import path from 'path';
import { dirname } from './utils.js';
import fs from 'fs';

export function generateBundle({ modules }) {
  const template = fs.readFileSync(  
    path.join(dirname(), "./bundle.ejs"),, {
    encoding: 'utf-8',
  });

  const code = ejs.render(template, { modules });
  return code;
}