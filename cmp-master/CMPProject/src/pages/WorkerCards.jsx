import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkerCards.css';
import { BASE_URL } from '../api';

function WorkerCards() {
  const [workers, setWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch all workers
  useEffect(() => {
    fetch(`${BASE_URL}/api/workers`)
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (!res.ok) throw new Error(await res.text());
        if (!contentType?.includes("application/json"))
          throw new Error("Expected JSON response");
        return res.json();
      })
      .then(data => {
        setWorkers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Delete worker
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this worker?')) return;
    try {
      const res = await fetch(`${BASE_URL}/api/workers/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setWorkers(workers.filter(worker => worker._id !== id));
      } else {
        const errMsg = await res.text();
        alert(`Delete failed: ${errMsg}`);
      }
    } catch (err) {
      console.error(err);
      alert('Delete failed. Please try again.');
    }
  };

  // Filter workers by selected field and search term
  const filteredWorkers = workers.filter(worker => {
    const value = worker[searchBy];
    return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="worker-cards-page">
      <h2>All Workers</h2>

      <div className="search-bar">
        <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
          <option value="name">Name</option>
          <option value="finNumber">FIN No</option>
          <option value="employer">Company</option>
          <option value="workPermitNumber">Permit No</option>
          <option value="sector">Sector</option>
          <option value="nationality">Nationality</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchBy}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading workers...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : filteredWorkers.length === 0 ? (
        <p>No workers found.</p>
      ) : (
        <div className="worker-table-wrapper">
          <table className="worker-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>FIN No</th>
                <th>Employer</th>
                <th>Work Permit</th>
                <th>Sector</th>
                <th>Nationality</th>
                <th>DOB</th>
                <th>Application</th>
                <th>Approval</th>
                <th>Expiry</th>
                <th>CSOC No</th>
                <th>BCSSC No</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((worker) => (
                <tr key={worker._id}>
                  <td>{worker.name}</td>
                  <td>{worker.finNumber}</td>
                  <td>{worker.employer}</td>
                  <td>{worker.workPermitNumber}</td>
                  <td>{worker.sector}</td>
                  <td>{worker.nationality}</td>
                  <td>{worker.dob?.substring(0, 10) || '-'}</td>
                  <td>{worker.applicationDate?.substring(0, 10) || '-'}</td>
                  <td>{worker.approvalDate?.substring(0, 10) || '-'}</td>
                  <td>{worker.expiryDate?.substring(0, 10) || '-'}</td>
                  <td>{worker.csocNumber || '-'}</td>
                  <td>{worker.bcsscNumber || '-'}</td>
                  <td>
                    <button onClick={() => navigate(`/edit-worker/${worker._id}`)}>Edit</button>
                    <button onClick={() => handleDelete(worker._id)} style={{ marginLeft: '6px' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default WorkerCards;
