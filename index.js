import config from './helpers/config.js'
import SkillCollection from './types/SkillCollection'
import { FORMAT_JSON } from './helpers/fileOperations'
import { setFailed } from '@actions/core'

async function exportCollection(collection) {

  await Promise.all([
    collection.export(FORMAT_JSON), 
    collection.exportSkills(FORMAT_JSON),
    collection.createMainIndexFile(),
    collection.createPackageJsonFile(),
    collection.createReadmeFile()
  ])
}

async function run() {
  try {
    const collection = await SkillCollection.fetchAndCreate(config.collection.uuid, config.collection.slug)
    await exportCollection(collection)
  } catch (error) {
    console.error('Error occurred:', error) // Detailed error logging
    setFailed(error.message)
  }
}

run()
