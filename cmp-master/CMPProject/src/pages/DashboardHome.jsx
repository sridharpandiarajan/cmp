import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/DashboardHome.css';

const DashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-home-wrapper">
      <div className="dashboard-container">
        <h1 className="dashboard-heading">📋 Worker Management System</h1>

        <div className="action-grid">
          <div className="action-card" onClick={() => navigate('/add')}>
            <div className="icon">➕</div>
            <div className="label">Add Worker</div>
          </div>
          <div className="action-card" onClick={() => navigate('/report')}>
            <div className="icon">📊</div>
            <div className="label">Reports</div>
          </div>
          <div className="action-card" onClick={() => navigate('/view')}>
            <div className="icon">📋</div>
            <div className="label">View Workers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
