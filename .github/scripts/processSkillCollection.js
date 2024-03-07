import fs from 'fs';
import yaml from 'js-yaml';

// Read the JSON data fetched from the API
const skillCollectionData = JSON.parse(fs.readFileSync('skillCollection.json', 'utf8'));

// Modify the data as per requirements
const modifiedSkillCollection = {
    ...skillCollectionData,
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    author: 'Western Governors University',
    owner: 'Western Governors University'
};

// Remove the 'skills' property
delete modifiedSkillCollection.skills;

// Convert to YAML
const yamlData = yaml.dump(modifiedSkillCollection, { lineWidth: -1 });

// Write to file
fs.writeFileSync('collection.skill.yaml', yamlData);
fs.writeFileSync('collection.skill.json', yamlData);

console.log('Skill collection processed and saved as collection.skill.yaml');
