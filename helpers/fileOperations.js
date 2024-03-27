import fs from 'fs/promises'
import path from 'path'
import { toCamelCase, createSlug } from './stringOperations.js'

const FORMAT_JSON = 'json'
const FORMAT_YAML = 'yaml'

const FILE_EXTENSIONS = {
  skillJson: '.skill.json',
  skillYaml: '.skill.yaml'
}

// Utility functions
const getFilePath = (fileName) => path.join(process.env.GITHUB_WORKSPACE, fileName)

const writeToFile = async (filePath, content) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content)
}

const listFiles = async (dir) => fs.readdir(dir)

// Collection File Creators
const createFileFromTemplate = async (collection, fileType, contentBuilder) => {
  try {
    const filePath = getFilePath(fileType)
    const content = await contentBuilder(collection)
    await writeToFile(filePath, content)
  } catch (error) {
    console.error(`Error creating ${fileType}:`, error)
    throw error
  }
}

const createIndexFile = async (collection) => {
  await createFileFromTemplate(collection, 'index.js', async (collection) => {
    // Validate and process skill names in parallel (if applicable)
    const processedSkills = collection.skills.map((skill) => {
      const variableName = toCamelCase(skill.slug)

      return {
        importStatement: `import ${variableName} from './skills/${ skill.category ? createSlug(skill.category) : 'uncategorized' }/${skill.slug}${FILE_EXTENSIONS.skillJson}';`,
        exportName: variableName
      }
    })

    // Construct the file content
    const fileContent = processedSkills.reduce(
      (content, skill) => {
        content.imports.push(skill.importStatement)
        content.exports.push(skill.exportName)
        return content
      },
      { imports: [], exports: [] }
    )

    return `${fileContent.imports.join('\n')}\n\nexport { ${fileContent.exports.join(', ')} };`
  })
}

const createMainIndexFile = async (collection) => {
  const skillsByCategory = await collection.getSkillsByCategory()
  const importStatements = []

  for (const categoryName in skillsByCategory) {
    const categorySlug = createSlug(categoryName)
    importStatements.push(`export * from './skills/${categorySlug}/index.js';`)
  }

  const mainIndexContent = importStatements.join('\n')
  const mainIndexPath = path.join(config.files.output_dir, 'index.js')
  await writeToFile(mainIndexPath, mainIndexContent)
}

const createPackageJsonFile = async (collection) => {
  console.log('Creating package.json')
  await createFileFromTemplate(collection, 'package.json', (collection) =>
    JSON.stringify(
      {
        name: collection.slug,
        version: collection.version,
        description: collection.description,
        main: 'index.js',
        scripts: { test: 'echo "Error: no test specified" && exit 1' },
        author: 'Western Governors University',
        license: 'https://creativecommons.org/licenses/by-sa/4.0/'
      },
      null,
      4
    )
  )
}

const createReadmeFile = async (collection) => {
  console.log('Creating README.md')
  const readmeFilePath = getFilePath('README.md')

  // Check if README.md already exists
  try {
    await fs.access(readmeFilePath)
    console.log('README.md already exists, skipping creation.')
    return
  } catch (error) {
    console.log('Creating README.md')
  }

  const readmeHeader = `# ${collection.name}\n\n${collection.description}\n\n`
  const skillsByCategory = await getSkillsByCategory()

  // Sort categories
  const categories = Object.keys(skillsByCategory).sort()

  // Create TOC
  const toc = categories
    .map((category) => {
      console.log(`Creating TOC for ${category}`)
      const anchor = createSlug(category) // Convert category to anchor
      return `- [${category}](#${anchor})`
    })
    .join('\n')

  // Generate markdown sections for each category
  const markdownSections = categories
    .map((category) => {
      console.log('Creating markdown section for', category)
      const sortedSkills = skillsByCategory[category].sort()
      const anchor = createSlug(category) // Convert category to anchor
      const skillLinks = sortedSkills
        .map((fileName) => {
          const skillSlug = fileName.replace(FILE_EXTENSIONS.skillJson, '')
          return `- ${skillSlug} [JSON](./skills/${category}/${fileName})`
        })
        .join('\n')

      return `### [${category}](#${anchor})\n\n${skillLinks}\n\n[Back to Top](#skills)\n`
    })
    .join('\n\n')

  const readmeContent = `${readmeHeader}## Skill Categories\n\n${toc}\n\n${markdownSections}`
  await writeToFile(readmeFilePath, readmeContent)
}

export {
  createMainIndexFile,
  writeToFile,
  createIndexFile,
  createPackageJsonFile,
  createReadmeFile,
  FORMAT_JSON,
  FORMAT_YAML
}
