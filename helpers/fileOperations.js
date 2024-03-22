const fs = require('fs/promises');
const path = require('path');
const yaml = require('js-yaml');
const { toCamelCase } = require('./stringOperations.js');
const config = require('./config.js');

const { output_dir } = config.files;

const FORMAT_JSON = "json";
const FORMAT_YAML = "yaml";
const FILE_EXTENSION_SKILL_JSON = ".skill.json";
const FILE_EXTENSION_SKILL_YAML = ".skill.yaml";

// Utility to get full path
const getFullPath = (collectionSlug, fileName) => path.join(output_dir, collectionSlug, fileName);

// Simplified writeToFile with directory creation
const writeToFile = async (filePath, content) => {
  console.log(`Writing file to ${filePath}`);
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content);
    console.log(`File written successfully to ${filePath}`);
  } catch (err) {
    console.error(`Error writing file: ${err}`);
    throw err;
  }
};

const listFiles = async (dir) => {
  try {
    const files = await fs.readdir(dir);
    return files;
  } catch (error) {
    console.error("Error in listing files:", error);
    throw error;
  }
};


const createIndexFile = async (collection) => {
  try {
    console.log("Creating index file")
    const files = await listFiles(getFullPath(collection.slug, "skills"))
    
    const { imports, exports } = files.reduce(
      (acc, file) => {
        if (file.endsWith(FILE_EXTENSION_SKILL_JSON)) {
          const variableName = toCamelCase(path.basename(file, FILE_EXTENSION_SKILL_JSON))
          acc.imports.push(`import ${variableName} from './skills/${file}';`)
          acc.exports.push(variableName)
        }
        return acc
      },
      { imports: [], exports: [] }
    )

    const combinedContent = `${imports.join("\n")}\n\nexport { ${exports.join(", ")} };`
    await writeToFile(collection.slug, "index.js", combinedContent)
    console.log("Index file created successfully.")
  } catch (error) {
    console.error("Error in creating index file:", error)
    throw error
  }
}

const createPackageJsonFile = async (collection) => {
  console.log("Creating package JSON file")
  const packageJSONContent = {
    name: collection.slug,
    version: collection.version,
    description: collection.description,
    main: "index.js",
    scripts: {
      test: 'echo "Error: no test specified" && exit 1'
    },
    author: "Western Governors University",
    license: "https://creativecommons.org/licenses/by-sa/4.0/"
  }

  try {
    await writeToFile(collection.slug, `package.json`, JSON.stringify(packageJSONContent, null, 4))
    console.log("Package JSON file created successfully.")
  } catch (error) {
    console.error("Error in creating Package JSON file:", error)
    throw error
  }
}

const createReadmeFile = async (collection) => {
  console.log("Creating README file")
  const readmeContent = `# ${collection.name}\n\n${collection.description}\n\n## Skills\n\n`
  console.log(readmeContent)

  try {
    const skillsPath = getFullPath(collection.slug, "skills");
    console.log("Skills path:", skillsPath)

    
    const skillFiles = await listFiles(skillsPath)
    
    const skillLinks = skillFiles
      .filter((skillFile) => skillFile.endsWith(FILE_EXTENSION_SKILL_JSON))
      .map(async (skillFile) => {

        const fullSkillFilePath = getFullPath(collection.slug, `skills/${skillFile}`)

        const content = await fs.readFile(fullSkillFilePath, 'utf8');
        const skill = JSON.parse(content);
  
        const baseFileName = path.basename(fullSkillFilePath, FILE_EXTENSION_SKILL_JSON)
        return `- ${skill.skillName} [JSON](./skills/${baseFileName}${FILE_EXTENSION_SKILL_JSON}) [YAML](./skills/${baseFileName}${FILE_EXTENSION_SKILL_YAML})`
      })
      .join("\n")

    await writeToFile(`${collection.slug} README.md`, `${readmeContent}${skillLinks}`)
    console.log("README file created successfully.")

  } catch (error) {

    console.error("Error in creating README file:", error)
    throw error

  }
}


module.exports = { writeToFile, FORMAT_JSON, FORMAT_YAML, createIndexFile, createPackageJsonFile, createReadmeFile };