import { transformFromAst } from 'babel-core';
import parseBabel from '@babel/parser';
import traverse from '@babel/traverse';


export function parse(source) {
  const dependenciesPaths = [];
  const ast = parseBabel.parse(source, {
    sourceType: 'module',
  })

  traverse.default(ast, {
    ImportDeclaration({ node }) {
      dependenciesPaths.push(node.source.value);
    }
  })

  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  })
  
  return {
    code,
    dependenciesPaths,
  }
}