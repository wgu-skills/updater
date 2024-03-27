import slugify from 'slugify'

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

const createSlug = (name) => slugify(name, { lower: true, strict: true, trim: true })

export { createSlug, toCamelCase }
