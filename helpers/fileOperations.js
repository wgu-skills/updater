const fs = require('fs/promises');
const path = require('path');
const { toCamelCase } = require('./stringOperations.js');

const FILE_EXTENSIONS = {
  skillJson: ".skill.json",
  skillYaml: ".skill.yaml"
};

// Utility functions
const getFilePath = (fileName) => path.join(process.env.GITHUB_WORKSPACE, fileName);
const writeToFile = async (filePath, content) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content);
};
const listFiles = (dir) => fs.readdir(dir);

// Collection File Creators
const createFileFromTemplate = async (collection, fileType, contentBuilder) => {
  try {
    const filePath = getFilePath(`${collection.slug}/${fileType}`);
    const content = contentBuilder(collection);
    await writeToFile(filePath, content);
  } catch (error) {
    console.error(`Error creating ${fileType}:`, error);
    throw error;
  }
};

const createIndexFile = async (collection) => {
  await createFileFromTemplate(collection, 'index.js', (collection) => {
    const imports = [], exports = [];
    const skillsPath = getFilePath("skills");
    const files = await listFiles(skillsPath);

    files.forEach(file => {
      if (file.endsWith(FILE_EXTENSIONS.skillJson)) {
        const variableName = toCamelCase(path.basename(file, FILE_EXTENSIONS.skillJson));
        imports.push(`import ${variableName} from './skills/${file}';`);
        exports.push(variableName);
      }
    });

    return `${imports.join("\n")}\n\nexport { ${exports.join(", ")} };`;
  });
};

const createPackageJsonFile = async (collection) => {
  await createFileFromTemplate(collection, 'package.json', (collection) => JSON.stringify({
    name: collection.slug,
    version: collection.version,
    description: collection.description,
    main: "index.js",
    scripts: { test: 'echo "Error: no test specified" && exit 1' },
    author: "Western Governors University",
    license: "https://creativecommons.org/licenses/by-sa/4.0/"
  }, null, 4));
};

const createReadmeFile = async (collection) => {
  await createFileFromTemplate(collection, 'README.md', async (collection) => {
    const readmeHeader = `# ${collection.name}\n\n${collection.description}\n\n## Skills\n\n`;
    const skillsPath = getFilePath(`${collection.slug}/skills`);
    const skillFiles = await listFiles(skillsPath);

    const skillLinks = await Promise.all(skillFiles
      .filter(file => file.endsWith(FILE_EXTENSIONS.skillJson))
      .map(async (file) => {
        const skillName = path.basename(file, FILE_EXTENSIONS.skillJson);
        return `- ${skillName} [JSON](./skills/${skillName}${FILE_EXTENSIONS.skillJson}) [YAML](./skills/${skillName}${FILE_EXTENSIONS.skillYaml})`;
      }));

    return `${readmeHeader}${skillLinks.join("\n")}`;
  });
};

module.exports = { writeToFile, createIndexFile, createPackageJsonFile, createReadmeFile };
