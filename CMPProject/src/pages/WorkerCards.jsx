import React, { useEffect, useState } from 'react';
import '../css/WorkerCards.css';
import { useNavigate } from 'react-router-dom';

const WorkerCards = () => {
  const [workers, setWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/workers')
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error: ${text}`);
        }
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format (expected JSON)");
        }
        return res.json();
      })
      .then(data => setWorkers(data))
      .catch(err => console.error('Error fetching workers:', err.message));
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this worker?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/workers/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setWorkers(prev => prev.filter(worker => worker._id !== id));
      } else {
        alert("Failed to delete worker.");
      }
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };

  const filteredWorkers = workers.filter(worker => {
    const value = (worker[searchField] || '').toLowerCase();
    return value.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="cards-wrapper">
      <h2 className="cards-title">👷 All Workers</h2>

      <div className="top-controls">
        <select
          className="search-select"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="finNumber">FIN No</option>
          <option value="workPermitNumber">Work Permit No</option>
          <option value="sector">Sector</option>
          <option value="nationality">Nationality</option>
        </select>

        <input
          className="search-input"
          type="text"
          placeholder={`Search by ${searchField}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button className="back-btn" onClick={() => navigate('/')}>🏠 Home</button>
      </div>

      <div className="table-container">
        <table className="worker-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Employer</th>
              <th>FIN No</th>
              <th>Work Permit</th>
              <th>DOB</th>
              <th>Sector</th>
              <th>Nationality</th>
              <th>App Date</th>
              <th>Approval Date</th>
              <th>Expiry Date</th>
              <th>Certificates</th>
              <th>Type</th>
              <th>CSOC No</th>
              <th>CSOC Date</th>
              <th>BCSS No</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkers.map((worker, index) => (
              <tr key={index}>
                <td>{worker.name || '-'}</td>
                <td>{worker.employer || '-'}</td>
                <td>{worker.finNumber || '-'}</td>
                <td>{worker.workPermitNumber || '-'}</td>
                <td>{formatDate(worker.dob) || '-'}</td>
                <td>{worker.sector || '-'}</td>
                <td>{worker.nationality || '-'}</td>
                <td>{formatDate(worker.applicationDate) || '-'}</td>
                <td>{formatDate(worker.approvalDate) || '-'}</td>
                <td>{formatDate(worker.expiryDate) || '-'}</td>
                <td>{worker.certificates || '-'}</td>
                <td>{worker.certificateType || '-'}</td>
                <td>
                  {worker.certificateType === 'CSOC' && worker.csocNumber
                    ? worker.csocNumber
                    : '-'}
                </td>
                <td>
                  {worker.certificateType === 'CSOC' && formatDate(worker.csocDate)
                    ? formatDate(worker.csocDate)
                    : '-'}
                </td>
                <td>
                  {worker.certificateType === 'BCSS' && worker.bcssNumber
                    ? worker.bcssNumber
                    : '-'}
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/edit-worker/${worker._id}`)}
                    className="action-btn edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(worker._id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {filteredWorkers.length === 0 && (
              <tr>
                <td colSpan="16" style={{ textAlign: 'center' }}>
                  No workers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerCards;
