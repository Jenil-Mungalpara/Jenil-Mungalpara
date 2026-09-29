const https = require('https');

const urls = [
    'https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=Jenil-Mungalpara&theme=tokyonight',
    'https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=Jenil-Mungalpara&theme=tokyonight'
];

urls.forEach(url => {
    https.get(url, (res) => {
        console.log(`${url}: ${res.statusCode}`);
    }).on('error', (e) => {
        console.error(`${url}: ERROR - ${e.message}`);
    });
});
