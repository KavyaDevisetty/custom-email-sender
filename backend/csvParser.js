const csv = require('csv-parser');
const fs = require('fs');

function parseCSV(filePath) {
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      console.log(results);
    });
}

module.exports = { parseCSV };
 
