const fs = require('fs');
const https = require('https');

const USERNAME = 'Jenil-Mungalpara';

function fetchRepos() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: `/users/${USERNAME}/repos?sort=updated&per_page=5`,
            headers: {
                'User-Agent': 'Node.js'
            }
        };

        https.get(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`API request failed with status ${res.statusCode}`));
                }
            });
        }).on('error', reject);
    });
}

async function updateReadme() {
    try {
        console.log('Fetching recent repositories...');
        const repos = await fetchRepos();
        
        let activityList = '';
        repos.forEach(repo => {
            const name = repo.name;
            const url = repo.html_url;
            const description = repo.description || 'No description provided';
            activityList += `- 🌟 [**${name}**](${url}) - ${description}\n`;
        });

        if (activityList === '') {
            activityList = '- No recent public repositories found.\n';
        }

        console.log('Reading template...');
        const template = fs.readFileSync('README.template.md', 'utf8');
        
        const startMarker = '<!-- LATEST_ACTIVITY_START -->';
        const endMarker = '<!-- LATEST_ACTIVITY_END -->';
        
        const startIndex = template.indexOf(startMarker) + startMarker.length;
        const endIndex = template.indexOf(endMarker);
        
        if (startIndex === -1 || endIndex === -1) {
            throw new Error('Markers not found in template');
        }
        
        const newReadme = 
            template.substring(0, startIndex) + 
            '\n' + activityList + 
            template.substring(endIndex);
            
        console.log('Writing README.md...');
        fs.writeFileSync('README.md', newReadme);
        console.log('Done!');
        
    } catch (error) {
        console.error('Error updating README:', error);
        process.exit(1);
    }
}

updateReadme();
