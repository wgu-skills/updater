import { setFailed } from '@actions/core';
import config from './helpers/config.js';
import SkillCollection from './types/SkillCollection';
import { FORMAT_JSON } from './helpers/fileOperations';

async function run() {
	try {

		const collection = await SkillCollection.fetchAndCreate(config.collection.uuid, config.collection.slug);
		// console.log('Collection:', collection);

		// Get the collection
		await Promise.all([
			// collection.export(FORMAT_YAML), // Export the collection
			// collection.exportSkills(FORMAT_YAML), // Export the skills
			collection.export(FORMAT_JSON), // Export the collection
			collection.exportSkills(FORMAT_JSON), // Export the skills
			collection.createIndexFile(), // Create the index file
			collection.createPackageJsonFile(), // Create the package.json file
			collection.createReadmeFile() // Create the README file
		]);

	} catch (error) {
		setFailed(error.message);
	}
}

run();
