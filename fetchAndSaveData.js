import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


const url = "https://aa-skill.wgu.edu/api/collections"

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchAndSave = async (item) => {
  try {
    const response = await fetch(`${url}/${item.uuid}`, { headers: { Accept: "application/json" } })
    const filename = `${item.slug}.json`

    if (!response.ok) {
      throw new Error(`Network response not ok: ${response.status}`)
    }

    const json = await response.json()

    fs.writeFileSync(path.join(__dirname, "collections", filename), JSON.stringify(json, null, 2))
    console.log(`Data saved to ${filename}`)
  } catch (error) {
    console.error(`Error fetching ${item.url}:`, error)
  }
}

const processBatch = async (batch) => {
  await Promise.all(batch.map((item) => fetchAndSave(item)))
}

const fetchAndSaveData = async (collections) => {
  try {
    for (let i = 0; i < collections.length; i += 2) {
      await processBatch(collections.slice(i, i + 2))
      if (i + 2 < collections.length) {
        console.log("Waiting for 5 seconds")
        await delay(5000) // Wait for 1 minute
      }
    }
  } catch (error) {
    console.error("Error:", error)
  }
}


export default fetchAndSaveData