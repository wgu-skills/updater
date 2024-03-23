const { writeToFile, createIndexFile, createPackageJsonFile, createReadmeFile, FORMAT_JSON } = require("../helpers/fileOperations.js");
const { updateRepo } = require("../helpers/gitOperations.js");
const Skill = require("./Skill.js");
const config = require("../helpers/config.js");
const path = require("path");
const yaml = require("js-yaml");

class SkillCollection {
  constructor(data) {
    const {
      uuid,
      id,
      name,
      description,
      type,
      status,
      "@context": context,
      owner,
      author,
      creator,
      creationDate,
      updateDate,
      publishDate,
      archiveDate,
      skills
    } = data;

    Object.assign(this, {
      uuid,
      id,
      name,
      description,
      type,
      status,
      context,
      owner,
      author,
      creator,
      creationDate,
      updateDate,
      publishDate,
      archiveDate,
      slug: config.collection.slug,
      skills: skills.map(skill => new Skill(skill))
    });
  }

  async export(format) {
    const formattedCollection = { ...this, skills: this.skills.map(skill => skill.get()) };
    const dataToWrite = format === FORMAT_JSON ? JSON.stringify(formattedCollection, null, 4) : yaml.dump(formattedCollection);
    const fileName = path.join(config.files.output_dir, this.slug, `collection.skill.${format}`);
    await writeToFile(fileName, dataToWrite);
  }

  async exportSkills(format) {
    await Promise.all(this.skills.map(skill => skill.export(this, format)));
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

module.exports = SkillCollection;
