import fs from 'fs';
import yaml from 'js-yaml';
import slugify from 'slugify';

// Read the JSON data fetched from the API
const skillCollectionData = JSON.parse(fs.readFileSync('skillCollection.json', 'utf8'));
const skills = skillCollectionData.skills;

skills.forEach(skill => {
    
    console.log(`Processing ${skill.skillName}`);

    // Modify the data as per requirements
    const modifiedSkill = {
        ...skill,
        license: 'https://creativecommons.org/licenses/by-sa/4.0/'
    }

    // Get the slug
    const slug = slugify(skill.skillName, { lower: true });

    // Convert the modified skill to YAML
    const yamlData = yaml.dump(modifiedSkill, { lineWidth: -1 });

    // Write to file
    fs.writeFileSync(`${slug}.skill.json`, modifiedSkill);
    fs.writeFileSync(`${slug}.skill.yaml`, yamlData);

});

console.log('Skills processed and saved as JSON and YAML files');