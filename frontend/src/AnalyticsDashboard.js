


// AnalyticsDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AnalyticsDashboard.css';

function AnalyticsDashboard() {
  const [data, setData] = useState({ totalSent: 0, pending: 0, scheduled: 0, failed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/analytics');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="analytics-dashboard">
      <h2>Email Analytics</h2>
      <p>Total Sent: {data.totalSent}</p>
      <p>Pending: {data.pending}</p>
      <p>Scheduled: {data.scheduled}</p>
      <p>Failed: {data.failed}</p>
    </div>
  );
}

export default AnalyticsDashboard;
