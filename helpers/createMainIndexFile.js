import { createSlug } from './stringOperations.js';
import { getFilePath, writeToFile } from './fileOperations.js';

const createMainIndexFile = async (collection) => {
  const skillsByCategory = await collection.getSkillsByCategory();
  const importStatements = Object.keys(skillsByCategory).map(categoryName => {
    const categorySlug = createSlug(categoryName);
    return `export * from './skills/${categorySlug}/index.js';`;
  }).join('\n');

  const mainIndexPath = getFilePath('index.js');
  await writeToFile(mainIndexPath, importStatements);
};

export default createMainIndexFile;