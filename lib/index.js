import { Compiler } from './Compiler';

export function webpack(config) {
  const compiler = new Compiler(config);
  config.run();
}