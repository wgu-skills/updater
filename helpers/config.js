const dotenv = require('dotenv');
dotenv.config();

const checkEnvVariable = (key, defaultValue = null) => {
  const value = process.env[key];
  if (typeof value === "undefined") {
    if (defaultValue !== null) {
      console.warn(`Environment variable ${key} is not set. Using default value.`);
      return defaultValue;
    }
    console.error(`Environment variable ${key} is missing.`);
    return null;
  }
  return value;
};

const config = {
  collection: {
    slug: checkEnvVariable("COLLECTION_SLUG", "default-slug"),
    uuid: checkEnvVariable("COLLECTION_UUID", "168fae01-783d-422e-8b9f-93b9dc9102ea"),
    url: checkEnvVariable("COLLECTION_URL", "https://aa-skill.wgu.edu/api/collections")
  },
  files: {
    output_dir: checkEnvVariable("OUTPUT_DIR", "./dist")
  },
  git: {
    pat: checkEnvVariable("GIT_PAT", ""),
    username: checkEnvVariable("GIT_USERNAME", "davidjpetersen"),
    email: checkEnvVariable("GIT_EMAIL", "david.petersen@wgu.edu"),
    org: checkEnvVariable("GIT_ORG", "wgu-skills")
  }
};

Object.keys(config).forEach((group) => {
  Object.entries(config[group]).forEach(([key, value]) => {
    if (value === null) {
      throw new Error(`Required environment variable ${key} is missing in ${group}`);
    }
  });
});

module.exports = config;
