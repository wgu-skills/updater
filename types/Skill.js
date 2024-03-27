import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';
import config from '../helpers/config.js';
import { FORMAT_JSON, FORMAT_YAML, writeToFile } from '../helpers/fileOperations.js';
import { createSlug } from '../helpers/stringOperations.js';

export default class Skill {
  constructor(data, collection) {
    Object.assign(this, {
      ...data,
      slug: createSlug(data.skillName),
      collection
    });
  }

  get() {
    return { ...this };
  }

  async export(format) {
    const categorySlug = this.category ? createSlug(this.category) : 'uncategorized';
    const skillFolder = path.join(config.files.output_dir, 'skills', categorySlug);
    const fileName = path.join(skillFolder, `${this.slug}.skill.${format}`);
    const indexFile = path.join(skillFolder, 'index.js');

    // Check if the index file exists, if not, create it
    if (!fs.existsSync(indexFile)) {
      fs.writeFileSync(indexFile, '', { flag: 'w' });
    }

    // Append import statement to the index file
    const importStatement = `import ${this.slug} from './${this.slug}.skill.${format}';\n`;
    fs.appendFileSync(indexFile, importStatement);

    let dataString;
    switch (format) {
      case FORMAT_JSON:
        dataString = JSON.stringify(this.get(), null, 4);
        break;
      case FORMAT_YAML:
        dataString = yaml.dump(this.get());
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    await writeToFile(fileName, dataString);
  }
}
