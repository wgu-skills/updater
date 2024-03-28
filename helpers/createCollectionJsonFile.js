import { writeToFile } from './fileOperations'
import yaml from 'js-yaml'
import { FORMAT_JSON } from './fileOperations'

const createCollectionJsonFile = async (collection, format) => {
  const formattedCollection = {
    ...collection,
    skills: collection.skills.map((skill) => {
      const { slug, ...rest } = skill.get()
      return rest
    })
  }

  const dataToWrite =
    format === FORMAT_JSON ? JSON.stringify(formattedCollection, null, 4) : yaml.dump(formattedCollection)

  await writeToFile(`./collection.skill.${format}`, dataToWrite)
}

export default createCollectionJsonFile
