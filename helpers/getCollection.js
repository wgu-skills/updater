import fetch from "node-fetch";
import config from "./config.js";
import SkillCollection from "../types/SkillCollection.js";

const { url } = config.collection;

/**
 * Fetches and returns a SkillCollection from the specified url.
 * @returns {Promise<SkillCollection>} A SkillCollection instance.
 * @throws {Error} Throws an error if the network response is not ok or JSON parsing fails.
 */
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

export default getCollection;
