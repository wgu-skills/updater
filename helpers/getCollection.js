const fetch = require('node-fetch');
const config = require('./config.js');
const SkillCollection = require('../types/SkillCollection.js');

const { url } = config.collection;

const getCollection = async (url, slug) => {
  try {
    const response = await fetch(url, { headers: { Accept: "application/json" } });

    if (!response.ok) {
      throw new Error(`Network response not ok: ${response.status}`);
    }

    const json = await response.json();
    return new SkillCollection(json, slug);

  } catch (error) {
    console.error(`Error fetching collection for uuid: ${uuid}`, error);
    throw error;  // Propagating the same error object
  }
};

module.exports = getCollection;
