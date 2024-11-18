

// RealTimeDashboard.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './RealTimeDashboard.css';

const socket = io('http://localhost:5000');

function RealTimeDashboard() {
  const [status, setStatus] = useState({});

  useEffect(() => {
    socket.on('emailStatus', (data) => {
      setStatus(data);
    });

    return () => {
      socket.off('emailStatus');
    };
  }, []);

  return (
    <div className="realtime-dashboard">
      <h2>Email Status</h2>
      <p>Sent: {status.sent}</p>
      <p>Pending: {status.pending}</p>
      <p>Scheduled: {status.scheduled}</p>
      <p>Failed: {status.failed}</p>
    </div>
  );
}

export default RealTimeDashboard;

