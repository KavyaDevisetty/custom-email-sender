const axios = require('axios');

async function generateContent(prompt, rowData) {
  const response = await axios.post('https://api.groq.com/generate', {
    prompt,
    data: rowData,
  });
  return response.data.content;
}

module.exports = { generateContent };
 
