import slugify from "slugify"

const toCamelCase = (fileName) =>
  fileName
    .split("-")
    .map((word, index) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join("")
    .replace(/[^a-zA-Z0-9]/g, "")
    .replace(/^./, (str) => str.toLowerCase())

const createSlug = (name) => slugify(name, { lower: true, strict: true })

export { createSlug , toCamelCase }
