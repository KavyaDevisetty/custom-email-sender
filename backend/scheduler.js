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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = { createTransporter, sendEmail };

