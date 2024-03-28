import { toCamelCase, createSlug } from './stringOperations.js';
import { FILE_EXTENSIONS } from './fileOperations.js';

const createIndexFileContent = (collection) => {
  const processedSkills = collection.skills.map((skill) => {
    const variableName = toCamelCase(skill.slug);
    const importStatement = `import ${variableName} from './skills/${skill.category ? createSlug(skill.category) : 'uncategorized'}/${skill.slug}${FILE_EXTENSIONS.skillJson}';`;
    return { importStatement, exportName: variableName };
  });

  const imports = processedSkills.map(skill => skill.importStatement).join('\n');
  const exports = processedSkills.map(skill => skill.exportName).join(', ');
  return `${imports}\n\nexport { ${exports} };`;
};
