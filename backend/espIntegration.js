const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmailWithSendGrid(to, subject, text) {
  const msg = {
    to,
    from: 'your-email@example.com',
    subject,
    text,
  };

  await sgMail.send(msg);
}

module.exports = { sendEmailWithSendGrid };
 
