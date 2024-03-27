import yaml from 'js-yaml';
import { FORMAT_JSON, FORMAT_YAML } from "../helpers/fileOperations.js"
import { writeToFile } from '../helpers/fileOperations.js';
import { createSlug } from '../helpers/stringOperations.js';
import config from '../helpers/config.js';
import path from 'path';

export default class Skill {
  constructor(data, collection) {
    Object.assign(this, {
      ...data,
      slug: createSlug(data.skillName),
      collection,
    });
  }

  get() {
    return { ...this, slug: undefined };
  }

  async export(collection, format) {

    const category = skill.category ? createSlug(skill.category) : 'uncategorized';
    const fileName = path.join(config.files.output_dir, `skills`, category, `${this.slug}.skill.${format}`);

    let dataString;

    if (format === FORMAT_JSON) {
      dataString = JSON.stringify(this.get(), null, 4);
    } else if (format === FORMAT_YAML) {
      dataString = yaml.dump(this.get());
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }

    // console.log(`Exporting skill data to ${fileName}`);
    await writeToFile(fileName, dataString);
  }
}
