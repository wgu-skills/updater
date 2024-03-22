import { getInput, setFailed } from '@actions/core';

async function run() {
    try {
        const skillCollectionUrl = getInput('skillCollectionUrl');
        const patToken = getInput('patToken');
        console.log(`Skill Collection URL: ${skillCollectionUrl}`);
        
    } catch (error) {
        setFailed(error.message);
    }
}

run();
