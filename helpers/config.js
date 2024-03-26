import { getInput } from '@actions/core';

const checkEnvVariable = (key, defaultValue = null) => {
  const value = getInput(key)
  if (typeof value === "undefined") {
    if (defaultValue !== null) {
      console.warn(`Environment variable ${key} is not set. Using default value.`)
      return defaultValue
    }
    console.error(`Environment variable ${key} is missing.`)
    return null
  }
  return value
}

// Environment variables grouped and validated
const config = {
  collection: {
    slug: getInput('skillCollectionSlug'),
    uuid: getInput('skillCollectionUuid'),
    url: getInput('skillCollectionUrl')
  },
  files: {
    output_dir: process.env.GITHUB_WORKSPACE
  },
  git: {
    org: getInput('gitOrg'),
    username: getInput('gitUsername'),
    email: getInput('gitEmail')
  }
}

// Throw an error if any required variable is missing
Object.keys(config).forEach((group) => {
  Object.entries(config[group]).forEach(([key, value]) => {
    if (value === null) {
      throw new Error(`Required environment variable ${key} is missing in ${group}`)
    }
  })
})

export default config
