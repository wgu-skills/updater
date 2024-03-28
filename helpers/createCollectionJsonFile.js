import { writeToFile } from './fileOperations'
import yaml from 'js-yaml'
import { FORMAT_JSON } from './fileOperations'

const createCollectionJsonFile = async (collection, format) => {
  // Extracting only necessary properties from each skill
  const formattedCollection = {
    ...collection,
    skills: collection.skills.map((skill) => {
      const { slug, ...rest } = skill.get()
      return rest
    })
  }

  // Choose the format based on the input parameter
  const dataToWrite =
    format === FORMAT_JSON ? JSON.stringify(formattedCollection, null, 4) : yaml.dump(formattedCollection)

  // Write the formatted data to a file
  await writeToFile(`./collection.skill.${format}`, dataToWrite)
}

export default createCollectionJsonFile
