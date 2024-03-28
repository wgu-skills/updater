import fs from 'fs/promises';

const createLicenseFile = async () => {

  const licenseUrl = 'https://creativecommons.org/licenses/by/4.0/legalcode.txt';

  async function fetchAndWriteLicense() {
    try {
      const response = await fetch(licenseUrl);
      const licenseText = await response.text();

      fs.writeFile('LICENSE.md', licenseText, 'utf8', (err) => {
        if (err) {
          console.error('An error occurred:', err);
          return;
        }
        console.log('LICENSE.md created with CC BY 4.0 content.');
      });
    } catch (error) {
      console.error('Failed to fetch the license:', error);
    }
  }

  fetchAndWriteLicense();

};
