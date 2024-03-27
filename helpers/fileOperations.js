import fs from 'fs/promises';
import path from 'path';
import config from './config.js';
import { toCamelCase, createSlug } from './stringOperations.js';

const FORMAT_JSON = 'json';
const FORMAT_YAML = 'yaml';
const FILE_EXTENSIONS = {
  skillJson: '.skill.json',
  skillYaml: '.skill.yaml'
};

const getFilePath = (fileName) => path.join(config.files.output_dir, fileName);

const writeToFile = async (filePath, content) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content);
};

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

const createMainIndexFile = async (collection) => {
  const skillsByCategory = await collection.getSkillsByCategory();
  const importStatements = Object.keys(skillsByCategory).map(categoryName => {
    const categorySlug = createSlug(categoryName);
    return `export * from './skills/${categorySlug}/index.js';`;
  }).join('\n');

  const mainIndexPath = getFilePath('index.js');
  await writeToFile(mainIndexPath, importStatements);
};

const createPackageJsonFile = async (collection) => {
  const packageContent = JSON.stringify({
    name: collection.slug,
    version: collection.version,
    description: collection.description,
    main: 'index.js',
    scripts: { test: 'echo "Error: no test specified" && exit 1' },
    author: 'Western Governors University',
    license: 'https://creativecommons.org/licenses/by-sa/4.0/'
  }, null, 4);

  await writeToFile(getFilePath('package.json'), packageContent);
};

const createReadmeFile = async (collection) => {
  const readmeFilePath = getFilePath('README.md');
  try {
    await fs.access(readmeFilePath);
    return;
  } catch (error) {
    const skillsByCategory = await collection.getSkillsByCategory();
    const categories = Object.keys(skillsByCategory).sort();

    const toc = categories.map(category => `- [${category}](#${createSlug(category)})`).join('\n');
    const markdownSections = categories.map(category => {
      const skillLinks = skillsByCategory[category].sort().map(fileName => 
        `- ${fileName.replace(FILE_EXTENSIONS.skillJson, '')} [JSON](./skills/${category}/${fileName})`
      ).join('\n');
      return `### [${category}](#${createSlug(category)})\n\n${skillLinks}\n\n[Back to Top](#skills)\n`;
    }).join('\n\n');

    const readmeContent = `# ${collection.name}\n\n${collection.description}\n\n## Skill Categories\n\n${toc}\n\n${markdownSections}`;
    await writeToFile(readmeFilePath, readmeContent);
  }
};

export {
  createMainIndexFile,
  writeToFile,
  createPackageJsonFile,
  createReadmeFile,
  FORMAT_JSON,
  FORMAT_YAML
};
