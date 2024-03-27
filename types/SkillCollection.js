import fetch from 'node-fetch'
import yaml from 'js-yaml'
import config from '../helpers/config.js'
import Skill from './Skill.js'
import {
  writeToFile,
  createIndexFile,
  createPackageJsonFile,
  createReadmeFile,
  FORMAT_JSON
} from '../helpers/fileOperations.js'

class SkillCollection {
  constructor(data) {
    this.type = data.type
    this.creationDate = data.creationDate
    this.name = data.name
    this.id = data.id
    this.owner = data.owner
    this.description = data.description
    this.status = data.status
    this.skills = data.skills
    this.author = data.author
    this.creator = data.creator
    this.uuid = data.uuid
    this.updateDate = data.updateDate
    this.publishDate = data.publishDate
    this.archiveDate = data.archiveDate
    this.context = data['@context']
    this.slug = config.collection.slug
    this.skills = data.skills.map((skill) => new Skill(skill))
  }

  static async fetchAndCreate(uuid, slug) {
    const url = `https://aa-skill.wgu.edu/api/collections/${uuid}`
    const response = await fetch(url, {
      headers: { Accept: 'application/json' }
    })

    if (!response.ok) {
      throw new Error(`Network response not ok: ${response.status}`)
    }

    const json = await response.json()
    return new SkillCollection({ ...json, slug })
  }

  async export(format) {
    const formattedCollection = {
      ...this,
      skills: this.skills.map((skill) => {
        const { slug, ...rest } = skill.get()
        return rest
      })
    }

    const dataToWrite =
      format === FORMAT_JSON ? JSON.stringify(formattedCollection, null, 4) : yaml.dump(formattedCollection)

    await writeToFile(`./collection.skill.${format}`, dataToWrite)
  }

  async getSkillsByCategory() {
    const skillsByCategory = {}
    const skillsDir = path.join(config.files.output_dir, 'skills')

    const categories = await fs.readdir(skillsDir, { withFileTypes: true })
    for (const category of categories) {
      if (category.isDirectory()) {
        const categoryName = category.name
        const categorySkills = await listFiles(path.join(skillsDir, categoryName))
        skillsByCategory[categoryName] = categorySkills
      }
    }

    return skillsByCategory
  }

  async exportSkills(format) {
    await Promise.all(this.skills.map((skill) => skill.export(format)))
  }

  async createIndexFile() {
    await createIndexFile(this)
  }

  async createPackageJsonFile() {
    await createPackageJsonFile(this)
  }

  async createReadmeFile() {
    await createReadmeFile(this)
  }
}

export default SkillCollection
