import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

// index.js

async function run() {
    try {
        const skillCollectionUrl = core.getInput('skillCollectionUrl');
        const patToken = core.getInput('patToken');

        // Perform your actions here, e.g., fetch data, git operations, etc.
        // Use the `exec` module to run shell commands if necessary

        
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
