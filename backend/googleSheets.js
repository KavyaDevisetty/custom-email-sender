const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

function getAuth() {
    const key = JSON.parse(fs.readFileSync(path.join(__dirname, 'config/credentials.json')));
    const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );
    return jwtClient;
}

async function getGoogleSheetData() {
    const auth = getAuth();
    const sheets = google.sheets('v4');
    try {
        const response = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId: 'your-spreadsheet-id',
            range: 'Sheet1!A1:D10',
        });
        return response.data.values;
    } catch (error) {
        console.error('Detailed error:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        throw new Error('Failed to fetch Google Sheet data');
    }
}

module.exports = { getGoogleSheetData };
