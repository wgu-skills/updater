import fs from 'fs/promises';
import path from 'path';
import config from './config.js';
import { toCamelCase, fixDuplicateSlugs, createSlug } from './stringOperations.js';

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
    license: config.collection.license,
  }, null, 4);

  await writeToFile(getFilePath('package.json'), packageContent);
};

const createReadmeFile = async (collection) => {
  const readmeFilePath = getFilePath('README.md');

  // Check if README already exists
  try {
    await fs.access(readmeFilePath);
    console.log('README.md already exists. No changes made.');
    return;
  } catch (error) {
    // File does not exist, continue with creation
  }

  const skillsByCategory = await collection.getSkillsByCategory();
  const categories = Object.keys(skillsByCategory).sort();

  let toc = categories.map(category => `- [${category}](#${createSlug(category)})`).join('\n');
  toc = fixDuplicateSlugs(toc); // Append a number to duplicate slugs to match GitHub's behavior

  let markdownSections = categories.map(category => {
    let skillsList = skillsByCategory[category]
      .sort()
      .map(skill => {
        return `- ${skill.skillName} [JSON](./skills/${createSlug(category)}/${createSlug(skill.skillName)}.skill.json)`;
      })
      .join('\n');
    
    return `### ${category}\n\n${skillsList}\n`;
  }).join('\n');

  let readmeContent = `# ${collection.name}\n\n[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)\n\n${collection.description}\n\n## Skill Categories\n\n${toc}\n\n## Skills\n\n${markdownSections}\n\n## Contributing\n\nPlease read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.`;

  // Write to file
  await writeToFile(readmeFilePath, readmeContent);
};

const createLicenseFile = async () => {
  const fs = require('fs');
  const fetch = require('node-fetch');
  
  const licenseUrl = 'https://creativecommons.org/licenses/by/4.0/legalcode.txt';
  
  async function fetchAndWriteLicense() {
      try {
          const response = await fetch(licenseUrl);
          const licenseText = await response.text();
  
          fs.writeFile('LICENSE.md', licenseText, 'utf8', (err) => {
              if (err) {
                  console.error('An error occurred:', err);
                  return;
              }
              console.log('LICENSE.md created with CC BY 4.0 content.');
          });
      } catch (error) {
          console.error('Failed to fetch the license:', error);
      }
  }
  
  fetchAndWriteLicense();
  
}

export {
  createMainIndexFile,
  writeToFile,
  createPackageJsonFile,
  createReadmeFile,
  FORMAT_JSON,
  FORMAT_YAML
};
