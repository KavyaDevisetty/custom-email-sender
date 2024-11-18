const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Custom Email Sender Backend');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const { getGoogleSheetData } = require('./googleSheets');

app.get('/google-sheet-data', async (req, res) => {
  const auth = await getGoogleAuth(); // Implement Google OAuth2 authentication
  const data = await getGoogleSheetData(auth);
  res.json(data);
});

const { generateContent } = require('./contentGeneration');

app.post('/generate-content', async (req, res) => {
  const { prompt, rowData } = req.body;
  const content = await generateContent(prompt, rowData);
  res.json({ content });
});

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

const { updateAnalytics } = require('./analytics');

app.get('/analytics', (req, res) => {
  const data = {
    sent: 10,
    pending: 5,
    scheduled: 3,
    failed: 2,
  };
  updateAnalytics(data);
  res.json(data);
});

const { sendEmailWithSendGrid } = require('./espIntegration');

app.post('/send-email-sendgrid', async (req, res) => {
  const { to, subject, text } = req.body;
  await sendEmailWithSendGrid(to, subject, text);
  res.send('Email sent with SendGrid');
});

const express = require('express');
// const app = express();
// const port = 5000;
const { createTransporter, sendEmail } = require('./emailSender');
const { updateAnalytics } = require('./analytics');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Custom Email Sender Backend');
});

app.post('/send-email', async (req, res) => {
  const { to, subject, text, user, pass } = req.body;
  const transporter = await createTransporter(user, pass);
  await sendEmail(transporter, to, subject, text);
  res.send('Email sent');
});

app.get('/analytics', (req, res) => {
  const data = {
    totalSent: 10,
    pending: 5,
    scheduled: 3,
    failed: 2,
  };
  updateAnalytics(data);
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const { getGoogleSheetData } = require('./googleSheets');
const { getGoogleAuth } = require('./googleAuth');

app.get('/google-sheet-data', async (req, res) => {
  try {
    const auth = await getGoogleAuth();
    const data = await getGoogleSheetData(auth);
    res.json(data);
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error);
    res.status(500).send('Error fetching Google Sheet data');
  }
});

const { parseCSV } = require('./csvParser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload-csv', upload.single('csvFile'), (req, res) => {
  parseCSV(req.file.path);
  res.send('CSV file uploaded and parsed');
});

const { createTransporter, sendEmail } = require('./emailSender');

app.post('/send-email', async (req, res) => {
  const { to, subject, text, user, pass } = req.body;
  const transporter = await createTransporter(user, pass);
  await sendEmail(transporter, to, subject, text);
  res.send('Email sent');
});

const { generateContent } = require('./contentGeneration');

app.post('/generate-content', async (req, res) => {
  const { prompt, rowData } = req.body;
  const content = await generateContent(prompt, rowData);
  res.json({ content });
});

const { updateAnalytics } = require('./analytics');

app.get('/analytics', (req, res) => {
  const data = {
    totalSent: 10,
    pending: 5,
    scheduled: 3,
    failed: 2,
  };
  updateAnalytics(data);
  res.json(data);
});

const { sendEmailWithSendGrid } = require('./espIntegration');

app.post('/send-email-sendgrid', async (req, res) => {
  const { to, subject, text } = req.body;
  await sendEmailWithSendGrid(to, subject, text);
  res.send('Email sent with SendGrid');
});

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


