const nodemailer = require('nodemailer');

async function createTransporter(user, pass) {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

async function sendEmail(transporter, to, subject, text) {
  const mailOptions = {
    from: 'your-email@example.com',
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { createTransporter, sendEmail };
 
