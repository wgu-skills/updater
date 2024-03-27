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


let slugCount = {};

const createSlug = (originalString) => {
    const slug = slugify(originalString, { lower: true, strict: true });
    
    // Check if the slug already exists and increment the count accordingly.
    if (slugCount[slug]) {
        slugCount[slug] += 1;
        return `${slug}-${slugCount[slug]}`;
    } else {
        // If it's the first time, just set the count to 1 and return the slug.
        slugCount[slug] = 1;
        return slug;
    }
};

export { createSlug, toCamelCase }
