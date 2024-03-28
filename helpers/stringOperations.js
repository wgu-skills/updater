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

let slugCount = {};

// This function now expects a list of categories
const createSlugsForCategories = (categories) => {
    const slugs = categories.map(category => {
        const slug = slugify(category, { lower: true, strict: true });
        if (!slugCount[slug]) {
            slugCount[slug] = 1; // First occurrence of this category
            return slug;
        } else {
            slugCount[slug] += 1; // Subsequent occurrence
            return `${slug}-${slugCount[slug]}`;
        }
    });

    return slugs;
};

export { createSlug, createSlugsForCategories, toCamelCase }
