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

const createSlug = (name) => {
    const slugCount = {};
    return (originalString) => {
        const slug = slugify(originalString, { lower: true, strict: true });
        slugCount[slug] = (slugCount[slug] || 0) + 1;
        return slugCount[slug] > 1 ? `${slug}-${slugCount[slug]}` : slug;
    };
}
export { createSlug, toCamelCase }
