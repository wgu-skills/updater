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

class SkillCollection {
  
	constructor(data) {
		// Assigning properties more concisely
		Object.assign(this, data, {
			slug: config.collection.slug,
			skills: data.skills.map((skill) => new Skill(skill)),
		});
	}

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

	async exportSkills(format) {
		await Promise.all(this.skills.map((skill) => skill.export(this, format)));
	}

	async createIndexFile() {
		await createIndexFile(this);
	}

	async createPackageJsonFile() {
		await createPackageJsonFile(this);
	}

	async createReadmeFile() {
		await createReadmeFile(this);
	}

	async updateRepo() {
		await updateRepo();
	}
}

export default SkillCollection;
