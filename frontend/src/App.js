// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PromptBox from './PromptBox';
import AnalyticsDashboard from './AnalyticsDashboard';
import RealTimeDashboard from './RealTimeDashboard';
import './App.css';
import axios from 'axios';
import AuthGoogle from './AuthGoogle';




function App() {
  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>Custom Email Sender</h1>
          <nav>
            <ul>
             
              <li><Link to="/analytics">Analytics Dashboard</Link></li>
              <li><Link to="/realtime">Real-Time Dashboard</Link></li>
              <li><Link to="/google-sheets">Google Sheets Data Reader</Link></li>
              <li><Link to="/auth/google">Connect Email</Link></li>
              <li><Link to="/prompt">Prompt Box</Link></li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/prompt" element={<PromptBox />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/realtime" element={<RealTimeDashboard />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/google-sheets" element={<GoogleSheetsDataReader />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth/google" element={<AuthGoogle />} />
        </Routes>
        <footer className="footer">
          <p>&copy; 2024 Custom Email Sender</p>
        </footer>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="home-page">
      <img
        src="/image1.jpg"
        alt="Custom Email Sender"
        width="500"
        height="300"
        className="custom-image"
      />
    </div>
  );
}

function GoogleSheetsDataReader() {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/data', { spreadsheetId });
      setData(response.data);
    } catch (error) {
      setError(`Error reading data from Google Sheets: ${error.message}`);
      console.error('Error reading data from Google Sheets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-sheets-data-reader">
      <h1>Google Sheets Data Reader</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Spreadsheet ID:
          <input
            type="text"
            value={spreadsheetId}
            onChange={(e) => setSpreadsheetId(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="get-data-button">Get Data</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div>
          <h2>Data from Google Sheets</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {data[0].map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <a href="/logout">Logout</a>
    </div>
  );
}

// function AuthGoogle() {
//   return (
//     <div>
//       <h1>Connect Your Email Account</h1>
//       <a href="http://localhost:5000/auth/google">Connect with Google</a>
//     </div>
//   );
// }
function SendEmail()  {
  return (
    <div>
      <h1>Email Sending Application</h1>
      <PromptBox />
    </div>
  );
};

export default App;
