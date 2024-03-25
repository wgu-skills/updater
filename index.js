import { setFailed } from '@actions/core';
import getCollection from './helpers/getCollection';
import config from './helpers/config';
// import { FORMAT_JSON, FORMAT_YAML } from './helpers/fileOperations';

async function run() {
	try {
		// Debug: Log the config and collection config
		console.log('Config:', config);

		const collection = await SkillCollection.fetchAndCreate('1db79be3-ff33-4114-8449-e151aa9e6b25', 'accountants-and-auditors');

		// Get the collection
		// await Promise.all([
		// 	collection.export(FORMAT_JSON), // Export the collection
		// 	collection.export(FORMAT_YAML), // Export the collection
		// 	collection.exportSkills(FORMAT_JSON), // Export the skills
		// 	collection.exportSkills(FORMAT_YAML), // Export the skills
		// 	collection.createIndexFile(), // Create the index file
		// 	collection.createPackageJsonFile(), // Create the package.json file
		// 	collection.createReadmeFile() // Create the README file
		// ]);

		// Check if the directory is a git repository
		// collection.updateRepo()
	} catch (error) {
		setFailed(error.message);
	}
}

run();
