// PromptBox.js
import React, { useState } from 'react';
import axios from 'axios';

function PromptBox() {
  const [prompt, setPrompt] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('http://localhost:5000/api/send-email', {
        to: email,
        subject,
        text: prompt,
      });
      setSuccess('Email sent successfully');
    } catch (error) {
      setError(`Error sending email: ${error.message}`);
      console.error('Error sending email:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prompt-box">
      <h1>Customize Your Email Prompt</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email   :<br></br>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input"
          />
        </label><br></br>
        <label>
          Subject:<br></br>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="subject-input"
          />
        </label><br></br>

        <label>
          Prompt:<br></br>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            className="prompt-input"
          />
        </label><br></br>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Sending...' : 'Send Email'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default PromptBox;
