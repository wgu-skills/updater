const yaml = require('js-yaml');
const { FORMAT_JSON, FORMAT_YAML } = require("../helpers/fileOperations.js");
const { writeToFile } = require('../helpers/fileOperations.js');
const { createSlug } = require('../helpers/stringOperations.js');
const config = require('../helpers/config.js');
const path = require('path');

class Skill {
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
    const fileName = path.join(config.files.output_dir, collection.slug, `skills/${this.slug}.skill.${format}`);
    let dataString;

    if (format === FORMAT_JSON) {
      dataString = JSON.stringify(this.get(), null, 4);
    } else if (format === FORMAT_YAML) {
      dataString = yaml.dump(this.get());
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }

    console.log(`Exporting skill data to ${fileName}`);
    await writeToFile(fileName, dataString);
  }
}

module.exports = Skill;
