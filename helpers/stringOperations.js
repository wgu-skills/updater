import slugify from 'slugify'


const createSlug = (name) => slugify(name, { lower: true, strict: true, trim: true })

const toCamelCase = (fileName) => {
  if (typeof fileName !== 'string') {
    console.error('toCamelCase error: Input is not a string', fileName)
    return '' // Return a default value or handle the error as appropriate
  }

  return fileName
    .split('-')
    .map((word, index) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^./, (str) => str.toLowerCase())
}

const fixDuplicateSlugs = (toc) => {
    const slugs = new Map()
    const fixedToc = toc.split('\n').map((line) => {
        const slug = line.match(/\(#(.*)\)/)
        if (slug) {
            const [_, slugName] = slug
            if (slugs.has(slugName)) {
                const count = slugs.get(slugName) + 1
                slugs.set(slugName, count)
                return line.replace(slugName, `${slugName}-${count}`)
            }
            slugs.set(slugName, 0)
        }
        return line
    })
    return fixedToc.join('\n')
}


export { createSlug, toCamelCase, fixDuplicateSlugs }
