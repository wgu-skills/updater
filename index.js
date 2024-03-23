const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

async function fetchSkillCollection(url, token) {
    const headers = { 
        Accept: "application/json",
        ...(token && { Authorization: `token ${token}` })  // Adds Authorization header if token is provided
    };

    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
}

async function run() {
    try {
        const skillCollectionUrl = core.getInput('skillCollectionUrl');
        const patToken = core.getInput('patToken'); // Personal Access Token

        console.log(`Fetching skill collection from URL: ${skillCollectionUrl}`);
        const skillCollection = await fetchSkillCollection(skillCollectionUrl, patToken);

        const repoName = github.context.repo.repo;
        console.log(`Skill Collection for repository '${repoName}':`, skillCollection);
        
    } catch (error) {
        console.error('Failed to fetch skill collection:', error);
        core.setFailed(`Error: ${error.message}`);
    }
}

run();
