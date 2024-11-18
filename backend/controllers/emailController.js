const { sendEmail } = require('../services/emailService'); // Implement this function

const sendEmailController = async (req, res) => {
  const { prompt } = req.body;
  try {
    await sendEmail(prompt);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
};

module.exports = { sendEmailController };
 

