import fs from 'fs/promises';
import path from 'path';
import { createSlug, toCamelCase } from './stringOperations.js';

const FORMAT_JSON = 'json';
const FORMAT_YAML = 'yaml';

const FILE_EXTENSIONS = {
	skillJson: '.skill.json',
	skillYaml: '.skill.yaml',
};

// Utility functions
const getFilePath = (fileName) =>
	path.join(process.env.GITHUB_WORKSPACE, fileName);

const writeToFile = async (filePath, content) => {
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, content);
};

const listFiles = async (dir) => fs.readdir(dir);

// Collection File Creators
const createFileFromTemplate = async (collection, fileType, contentBuilder) => {
	try {
		const filePath = getFilePath(`${collection.slug}/${fileType}`);
		const content = await contentBuilder(collection);
		await writeToFile(filePath, content);
	} catch (error) {
		console.error(`Error creating ${fileType}:`, error);
		throw error;
	}
};

const createIndexFile = async (collection) => {
	await createFileFromTemplate(collection, 'index.js', async (collection) => {
			
		// Validate and process skill names in parallel (if applicable)
			const processedSkills = collection.skills.map((skill) => {
			
			const variableName = toCamelCase(skill.slug);
			// console.log(`Processing skill: ${skill.slug} as ${variableName}`);

			return {
				importStatement: `import ${variableName} from './skills/${skill.slug}${FILE_EXTENSIONS.skillJson}';`,
				exportName: variableName,
			};

		});

		// Construct the file content
		const fileContent = processedSkills.reduce(
			(content, skill) => {
				content.imports.push(skill.importStatement);
				content.exports.push(skill.exportName);
				return content;
			},
			{ imports: [], exports: [] }
		);

		return `${fileContent.imports.join(
			'\n'
		)}\n\nexport { ${fileContent.exports.join(', ')} };`;
	});
};

const createPackageJsonFile = async (collection) => {
	await createFileFromTemplate(collection, 'package.json', (collection) =>
		JSON.stringify(
			{
				name: collection.slug,
				version: collection.version,
				description: collection.description,
				main: 'index.js',
				scripts: { test: 'echo "Error: no test specified" && exit 1' },
				author: 'Western Governors University',
				license: 'https://creativecommons.org/licenses/by-sa/4.0/',
			},
			null,
			4
		)
	);
};

const createReadmeFile = async (collection) => {
    try {
        const readmeFilePath = getFilePath(`README.md`);

        // Check if README.md already exists
        try {
            await fs.access(readmeFilePath);
            console.log('README.md already exists, skipping creation.');
            return;
        } catch (error) {
            // File does not exist, proceed with creation
            console.log('Creating README.md');
        }

        const readmeHeader = `# ${collection.name}\n\n${collection.description}\n\n## Skills\n\n`;
        const skillsPath = getFilePath(`skills`);
        const skillFiles = await listFiles(skillsPath);

        const skillLinks = await Promise.all(
            skillFiles
                .filter((file) => file.endsWith(FILE_EXTENSIONS.skillJson))
                .map(async (file) => {
                    const skillName = path.basename(file, FILE_EXTENSIONS.skillJson);
                    return `- ${skillName} [JSON](./skills/${skillName}${FILE_EXTENSIONS.skillJson})`;
                })
        );

        const readmeContent = `${readmeHeader}${skillLinks.join('\n')}`;
        await writeToFile(readmeFilePath, readmeContent);
    } catch (error) {
        console.error(`Error creating README.md:`, error);
        throw error;
    }
};


export {
	writeToFile,
	createIndexFile,
	createPackageJsonFile,
	createReadmeFile,
	FORMAT_JSON,
	FORMAT_YAML,
};
