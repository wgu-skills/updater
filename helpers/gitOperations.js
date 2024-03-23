import simpleGit from "simple-git"
import fs from "fs"
import config from "./config.js"
import { Octokit } from "@octokit/rest"

const octokit = new Octokit({
  auth: config.git.pat
})

const isGitRepo = async (directory) => {
  const gitDir = `${directory}/.git`
  try {
    fs.accessSync(gitDir, fs.constants.R_OK)
    const git = simpleGit(directory)
    return git.checkIsRepo()
  } catch (error) {
    return false
  }
}

const initRepo = async (directory) => {
  const git = simpleGit(directory)
  return git.init()
}

const checkIfRepoExists = async (owner, repoName) => {
  try {
    await octokit.repos.get({
      owner: owner,
      repo: repoName
    })
    return true // The repository exists
  } catch (error) {
    if (error.status === 404) {
      return false // The repository does not exist
    }
    console.error("Error checking repository existence:", error)
    throw error // An error other than non-existence occurred
  }
}

async function createGitHubRepo(repoName) {
  try {
    const response = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      private: true // Set to false if you want a public repository
    })
    console.log("Repository created: ", response.data.html_url)
    return response.data.html_url
  } catch (error) {
    console.error("Error creating repository: ", error)
    throw error
  }
}

const updateRepo = async () => {
  const slug = config.collection.slug
  const outputDir = config.files.output_dir
  const gitDir = `${outputDir}/${slug}`
  const git = simpleGit(gitDir)

  // Check if the directory is a Git repository
  const isRepo = await git.checkIsRepo()
  if (!isRepo) {
    console.log(`Initializing new Git repository in ${gitDir}`)
    await git.init()
  }

  // Check if the repository exists on GitHub
  const repoExists = await checkIfRepoExists(config.git.org, slug)
  console.log(`The repo ${repoExists ? "exists" : "doesn't exist"} on GitHub.`)

  // Create the repository on GitHub if it doesn't exist
  if (!repoExists) {
    await createGitHubRepo(config.git.org, slug)
      .then((url) => console.log("Repo url: ", url))
      .catch((err) => console.error("Error creating repo: ", err))
    console.log(`Repository ${config.git.org}/${slug} created on GitHub.`)
  }

  const timestamp = new Date().toISOString()
  const remotes = await git.getRemotes(true)
  const hasOrigin = remotes.some((r) => r.name === "origin")

  // Add origin remote if it doesn't exist
  if (!hasOrigin) {
    console.log("Adding remote origin")
    const remoteUrl = `https://github.com/${config.git.org}/${slug}.git`
    await git.addRemote("origin", remoteUrl)
  }

  // Commit and push changes
  await git.add(".", { "-f": null }).catch((err) => console.error("Error adding files: ", err))
  await git.commit(`Automatically updated on ${timestamp}`).catch((err) => console.error("Error committing: ", err))
  await git.push("origin", "main").catch((err) => console.error("Error pushing to repo: ", err))

  console.log("Repository updated successfully.")
}

export { isGitRepo, initRepo, updateRepo, createGitHubRepo }
