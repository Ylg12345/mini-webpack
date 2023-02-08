export default function(source) {

  this.addDeps("jsonLoader");

  return `export default ${JSON.stringify(source)}`;
}