import fetch from 'node-fetch'

import config from '../helpers/config.js'
import Skill from './Skill.js'
import createCollectionJsonFile from '../helpers/createCollectionJsonFile.js'
import createPackageJsonFile from '../helpers/createPackageJsonFile.js'
import createMainIndexFile from '../helpers/createMainIndexFile.js'
import createReadmeFile from '../helpers/createReadmeFile.js'

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
    this.license = config.collection.license
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

  async export(format) {
    createCollectionJsonFile(this, format)
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
