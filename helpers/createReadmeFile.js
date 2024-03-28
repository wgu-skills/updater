import fs from 'fs/promises'
import { fixDuplicateSlugs, createSlug } from './stringOperations.js'
import { getFilePath, writeToFile } from './fileOperations.js'

const createReadmeFile = async (collection) => {
  const readmeFilePath = getFilePath('README.md')

  // Check if README already exists
  try {
    await fs.access(readmeFilePath)
    console.log('README.md already exists. No changes made.')
    return
  } catch (error) {
    // File does not exist, continue with creation
  }

  const skillsByCategory = await collection.getSkillsByCategory()
  const categories = Object.keys(skillsByCategory).sort()

  let toc = categories.map((category) => `- [${category}](#${createSlug(category)})`).join('\n')
  toc = fixDuplicateSlugs(toc) // Append a number to duplicate slugs to match GitHub's behavior

  let markdownSections = categories
    .map((category) => {
      let skillsList = skillsByCategory[category]
        .sort()
        .map((skill) => {
          return `- ${skill.skillName} [JSON](./skills/${createSlug(category)}/${createSlug(
            skill.skillName
          )}.skill.json)`
        })
        .join('\n')

      return `### ${category}\n\n${skillsList}\n`
    })
    .join('\n')

  let readmeContent = `# ${collection.name}\n\n${collection.description}\n\n## Skill Categories\n\n${toc}\n\n## Skills\n\n${markdownSections}\n\n## Contributing\n\nPlease read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.`

  // Write to file
  await writeToFile(readmeFilePath, readmeContent)
}

export default createReadmeFile
