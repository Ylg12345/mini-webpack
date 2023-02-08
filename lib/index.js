import { Compiler } from './compiler.js';

export function webpack(config) {
  const compiler = new Compiler(config);
  compiler.run();
}