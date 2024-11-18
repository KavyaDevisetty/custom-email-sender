const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const session = require('express-session');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();
const emailRoutes = require('./routes/emailRoutes');

// Load environment variables from the .env file
dotenv.config();

app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport.js for Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/dashboard');
});

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Hello, ${req.user.displayName}!`);
  } else {
    res.redirect('/auth/google');
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Google Sheets Data Reader Endpoint
app.post('/api/data', async (req, res) => {
  const { spreadsheetId } = req.body;
  try {
    const doc = new GoogleSpreadsheet(spreadsheetId);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const data = rows.map(row => row._rawData);
    res.json(data);
  } catch (error) {
    console.error('Detailed error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    res.status(500).json({ error: 'Error reading data from Google Sheets' });
  }
});

// Generate Custom Message using LLM API
async function generateCustomMessage(prompt, rowData) {
  try {
    const response = await axios.post('https://api.groq.com/generate', {
      prompt: `${prompt} ${JSON.stringify(rowData)}`,
      max_tokens: 150,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating custom message:', error);
    throw new Error('Failed to generate custom message');
  }
}

// Email Sending Endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, prompt, rows } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (const row of rows) {
      const customMessage = await generateCustomMessage(prompt, row);
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: customMessage,
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});

app.use('/api', emailRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
