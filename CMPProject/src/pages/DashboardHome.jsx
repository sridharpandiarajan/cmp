import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/DashboardHome.css';

const DashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-home-wrapper">
      <div className="dashboard-home-card">
        <div className="dashboard-title">
        <h2 style={{ marginBottom: '10px' }}>Collin Man Power</h2>
        <h2>🏗️ Worker Management</h2>
        </div>
        <div className="dashboard-buttons">
          <button onClick={() => navigate('/report')}>📊 Report</button>
          <button onClick={() => navigate('/add')}>➕ Add Worker</button>
          <button onClick={() => navigate('/view')}>📋View Workers</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
