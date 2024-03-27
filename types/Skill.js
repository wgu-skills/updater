import yaml from 'js-yaml'
import path from 'path'
import config from '../helpers/config.js'
import { FORMAT_JSON, FORMAT_YAML, writeToFile } from '../helpers/fileOperations.js'
import { createSlug } from '../helpers/stringOperations.js'

export default class Skill {
  constructor(data, collection) {
    Object.assign(this, {
      ...data,
      slug: createSlug(data.skillName),
      collection
    })
  }

  get() {
    return { ...this }
  }

  async export(format) {
    const categorySlug = this.category ? createSlug(this.category) : 'uncategorized'
    const fileName = path.join(config.files.output_dir, 'skills', categorySlug, `${this.slug}.skill.${format}`)

    let dataString
    switch (format) {
      case FORMAT_JSON:
        dataString = JSON.stringify(this.get(), null, 4)
        break
      case FORMAT_YAML:
        dataString = yaml.dump(this.get())
        break
      default:
        throw new Error(`Unsupported format: ${format}`)
    }

    await writeToFile(fileName, dataString)
  }
}
