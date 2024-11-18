const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function getGoogleAuth() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'path-to-your-credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const client = await auth.getClient();
  return client;
}

module.exports = { getGoogleAuth };
 
