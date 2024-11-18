// server.js or your main backend file
const express = require('express');
const passport = require('./auth');
const session = require('express-session');
const app = express();
const port = 5000;

app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/dashboard');
});

app.get('/dashboard', isLoggedIn, (req, res) => {
  res.send('Welcome to the dashboard!');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


