import config from './config.js'
import fs from 'fs/promises'
import path from 'path'

const FORMAT_JSON = 'json'
const FORMAT_YAML = 'yaml'
export const FILE_EXTENSIONS = {
  skillJson: '.skill.json',
  skillYaml: '.skill.yaml'
}

export const getFilePath = (fileName) => path.join(config.files.output_dir, fileName)

const writeToFile = async (filePath, content) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content)
}

export { FORMAT_JSON, FORMAT_YAML, writeToFile }
