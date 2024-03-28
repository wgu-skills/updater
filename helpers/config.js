const checkEnvVariable = (key, defaultValue = null) => {
  const value = process.env[key]
  if (typeof value === 'undefined' || value === '') {
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
    slug: checkEnvVariable('skillCollectionSlug'),
    uuid: checkEnvVariable('skillCollectionUuid'),
    url: checkEnvVariable('skillCollectionUrl'),
    license: checkEnvVariable('licenseUrl', 'https://creativecommons.org/licenses/by-sa/4.0/')
  },
  files: {
    output_dir: process.env.GITHUB_WORKSPACE
  },
  git: {
    org: checkEnvVariable('gitOrg', 'wgu-skills'),
    username: checkEnvVariable('gitUsername', ),
    email: checkEnvVariable('gitEmail')
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
