import * as core from '@actions/core';
import * as github from '@actions/github';
import getCollection from './helpers/getCollection';

async function run() {
	try {
		const skillCollectionUrl = core.getInput('skillCollectionUrl');
		const patToken = core.getInput('patToken');
        const repoName = github.context.repo.repo;

		console.log(`Skill Collection URL: ${skillCollectionUrl}`);

		const collection = await getCollection(skillCollectionUrl, repoName);

		// Get the collection
		await Promise.all([
			collection.export(FORMAT_JSON), // Export the collection
			collection.export(FORMAT_YAML), // Export the collection
			collection.exportSkills(FORMAT_JSON), // Export the skills
			collection.exportSkills(FORMAT_YAML), // Export the skills
			collection.createIndexFile(), // Create the index file
			collection.createPackageJsonFile(), // Create the package.json file
			collection.createReadmeFile() // Create the README file
		]);

		// Check if the directory is a git repository
		collection.updateRepo()
	} catch (error) {
		setFailed(error.message);
	}
}

run();
