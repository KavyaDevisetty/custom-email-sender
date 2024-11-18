const axios = require('axios');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function generateEmailContent(prompt) {
  const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
    prompt,
    max_tokens: 150,
  }, {
    headers: {
      'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
      'Content-Type': 'application/json',
    },
  });
  return response.data.choices[0].text.trim();
}

async function sendEmail(prompt) {
  const emailContent = await generateEmailContent(prompt);
  const msg = {
    to: 'recipient@example.com',
    from: 'sender@example.com',
    subject: 'Customized Email',
    text: emailContent,
  };
  await sgMail.send(msg);
}

module.exports = { sendEmail };
 
