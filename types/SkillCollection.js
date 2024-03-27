import fetch from 'node-fetch';
import yaml from 'js-yaml';
import config from '../helpers/config.js';
import Skill from './Skill.js';
import {
  writeToFile, createIndexFile, createPackageJsonFile, createReadmeFile, FORMAT_JSON
} from '../helpers/fileOperations.js';

class SkillCollection {
  constructor(data) {
    this.slug = config.collection.slug;
    this.skills = data.skills.map(skill => new Skill(skill));
  }

  static async fetchAndCreate(uuid, slug) {
    const url = `https://aa-skill.wgu.edu/api/collections/${uuid}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    
    if (!response.ok) {
      throw new Error(`Network response not ok: ${response.status}`);
    }

    const json = await response.json();
    return new SkillCollection({ ...json, slug });
  }

  async export(format) {
    const formattedCollection = {
      ...this,
      skills: this.skills.map(skill => skill.get())
    };
    const dataToWrite = format === FORMAT_JSON
      ? JSON.stringify(formattedCollection, null, 4)
      : yaml.dump(formattedCollection);
    
    await writeToFile(`./collection.skill.${format}`, dataToWrite);
  }

  async exportSkills(format) {
    await Promise.all(this.skills.map(skill => skill.export(format)));
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
}

export default SkillCollection;
