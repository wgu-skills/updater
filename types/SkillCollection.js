import fetch from 'node-fetch';
import Skill from './Skill.js';
import config from '../helpers/config.js';
import path from 'path';
import yaml from 'js-yaml';
import {
	writeToFile,
	createIndexFile,
	createPackageJsonFile,
	createReadmeFile,
	FORMAT_JSON,
} from '../helpers/fileOperations.js';
import { updateRepo } from '../helpers/gitOperations.js';

/**
 * Represents a collection of skills.
 * @class
 */
class SkillCollection {

	/**
	 * Represents a SkillCollection object.
	 * @constructor
	 * @param {Object} data - The data object used to initialize the SkillCollection.
	 * @param {string} data.slug - The slug of the SkillCollection.
	 * @param {Array} data.skills - An array of skills to be included in the SkillCollection.
	 */
	constructor(data) {
		// Assigning properties more concisely
		Object.assign(this, data, {
			slug: config.collection.slug,
			skills: data.skills.map((skill) => new Skill(skill)),
		});
	}

	/**
	 * Fetches a skill collection from the specified URL and creates a new instance of SkillCollection.
	 * @param {string} uuid - The UUID of the skill collection.
	 * @param {string} slug - The slug of the skill collection.
	 * @returns {Promise<SkillCollection>} A promise that resolves with a new instance of SkillCollection.
	 * @throws {Error} If the network response is not ok or an error occurs during the fetch operation.
	 */
	static async fetchAndCreate(uuid, slug) {
		const url = `https://aa-skill.wgu.edu/api/collections/${uuid}`;
		try {
			const response = await fetch(url, {
				headers: { Accept: 'application/json' },
			});
			if (!response.ok) {
				throw new Error(`Network response not ok: ${response.status}`);
			}
			const json = await response.json();
			return new SkillCollection({ ...json, slug });
		} catch (error) {
			console.error(`Error fetching collection for url: ${url}`, error);
			throw error;
		}
	}

	/**
	 * Exports the SkillCollection in the specified format.
	 * @param {string} format - The format to export the SkillCollection in. Can be 'json' or 'yaml'.
	 * @returns {Promise<void>} - A Promise that resolves when the export is complete.
	 */
	async export(format) {
		const formattedCollection = {
			...this,
			skills: this.skills.map((skill) => skill.get()),
		};

		const dataToWrite =
			format === FORMAT_JSON
				? JSON.stringify(formattedCollection, null, 4)
				: yaml.dump(formattedCollection);

		const fileName = path.join(
			config.files.output_dir,
			`collection.skill.${format}`
		);

		await writeToFile(fileName, dataToWrite);
	}

	/**
	 * Export the skills in the specified format.
	 * @param {string} format - The format in which to export the skills.
	 * @returns {Promise<void>} - A promise that resolves when the export is complete.
	 */
	async exportSkills(format) {
		await Promise.all(this.skills.map((skill) => skill.export(this, format)));
	}

	/**
	 * Creates an index file for the SkillCollection.
	 * @returns {Promise<void>} A promise that resolves when the index file is created.
	 */
	async createIndexFile() {
		await createIndexFile(this);
	}

	/**
	 * Creates a package.json file for the skill collection.
	 * @returns {Promise<void>} A promise that resolves when the package.json file is created.
	 */
	async createPackageJsonFile() {
		await createPackageJsonFile(this);
	}

	/**
	 * Creates a readme file for the skill collection.
	 * @returns {Promise<void>} A promise that resolves when the readme file is created.
	 */
	async createReadmeFile() {
		await createReadmeFile(this);
	}

	/**
	 * Updates the repository.
	 * @returns {Promise<void>} A promise that resolves when the repository is updated.
	 */
	async updateRepo() {
		await updateRepo();
	}
}

export default SkillCollection;
