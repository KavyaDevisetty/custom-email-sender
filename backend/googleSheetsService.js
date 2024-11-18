// backend/googleSheetsService.js
const { google } = require('googleapis');
const fs = require('fs');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const KEY_FILE_PATH = 'config/credentials.json'; // Path to the credentials file

async function authorize() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: SCOPES,
  });
  const authClient = await auth.getClient();
  return authClient;
}

async function readSheet(auth, spreadsheetId, range) {
  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return response.data.values;
}

module.exports = { authorize, readSheet };
