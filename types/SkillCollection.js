import fetch from 'node-fetch'
import yaml from 'js-yaml'
import config from '../helpers/config.js'
import Skill from './Skill.js'
import {
  writeToFile,
  FORMAT_JSON
} from '../helpers/fileOperations.js'
import { createPackageJsonFile } from '../helpers/createPackageJsonFile.js'
import { createMainIndexFile } from '../helpers/createMainIndexFile.js'
import { createReadmeFile } from '../helpers/createReadmeFile.js'

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

    // Iterate over each skill in the this.skills array
    this.skills.forEach((skill) => {
      const category = skill.category || 'Uncategorized'

      // Initialize the category array if it doesn't exist
      if (!skillsByCategory[category]) {
        skillsByCategory[category] = []
      }

      // Add the skill to its respective category
      skillsByCategory[category].push(skill)
    })

    return skillsByCategory
  }

  async exportSkills(format) {
    await Promise.all(this.skills.map((skill) => skill.export(format)))
  }


  async createMainIndexFile() {
    await createMainIndexFile(this)
  }

  async createPackageJsonFile() {
    await createPackageJsonFile(this)
  }

  async createReadmeFile() {
    await createReadmeFile(this)
  }
}

export default SkillCollection
