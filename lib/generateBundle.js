import ejs from 'ejs';
import fs from 'fs';


function generateFile(data, outputPath, templatePath) {
  const template = fs.readFileSync(templatePath, {
    encoding: 'utf-8',
  });

  const code = ejs.render(template, { data });
  fs.writeFileSync(outputPath, code);
}

export function generateBundle({ modules, outputPath, templatePath }) {
  generateFile(modules, outputPath, templatePath);
}

export function generateHtml({ htmlOptions, outputPath, templatePath }) { 
  generateFile(htmlOptions, outputPath, templatePath)
}