import yaml from 'js-yaml'
import path from 'path'
import fs from 'fs'
import config from '../helpers/config.js'
import { FORMAT_JSON, FORMAT_YAML, writeToFile } from '../helpers/fileOperations.js'
import { createSlug, toCamelCase } from '../helpers/stringOperations.js'

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

  export(format) {
    const categorySlug = this.category ? createSlug(this.category) : 'uncategorized'
    const fileName = `${this.slug}.skill.${format}`
    const categoryFolder = path.join(config.files.output_dir, `skills`, categorySlug)
    const filePath = path.join(categoryFolder, fileName)
    const indexFile = path.join(categoryFolder, 'index.js')

    try {
      // Ensure that the skill folder exists
      if (!fs.existsSync(categoryFolder)) {
        fs.mkdirSync(categoryFolder, { recursive: true })
      }

      // Ensure unique import statement in the index file
      this.appendToIndexFile(indexFile, fileName)

      // Prepare and write data string based on the format
      const dataString = this.prepareDataString(format)
      fs.writeFileSync(filePath, dataString)
    } catch (error) {
      console.error('Error in Skill.export:', error)
      throw error
    }
  }

  appendToIndexFile(indexFile, fileName) {
    if (!fs.existsSync(indexFile) || !fs.readFileSync(indexFile).includes(fileName)) {
      const importStatement = `import ${toCamelCase(this.slug)} from './${fileName}';\n`
      fs.appendFileSync(indexFile, importStatement)
    }
  }

  prepareDataString(format) {
    switch (format) {
      case FORMAT_JSON:
        return JSON.stringify(this.get(), null, 4)
      case FORMAT_YAML:
        return yaml.dump(this.get())
      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  }
}
