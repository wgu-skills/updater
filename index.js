import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

// index.js

async function run() {
    try {
        const skillCollectionUrl = core.getInput('skillCollectionUrl');
        const patToken = core.getInput('patToken');

        

        
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
