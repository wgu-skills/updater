import config from './config.js'
import { writeToFile, getFilePath } from './fileOperations.js'

const createPackageJsonFile = async (collection) => {
  const packageContent = JSON.stringify(
    {
      name: collection.slug,
      version: collection.version,
      description: collection.description,
      main: 'index.js',
      scripts: { test: 'echo "Error: no test specified" && exit 1' },
      author: 'Western Governors University',
      license: collection.license
    },
    null,
    4
  )

  await writeToFile(getFilePath('package.json'), packageContent)
}

export default createPackageJsonFile
