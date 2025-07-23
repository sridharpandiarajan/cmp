import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditWorker.css'; // optional custom styling

const EditWorker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState({
    name: '',
    employer: '',
    finNumber: '',
    workPermitNumber: '',
    dob: '',
    sector: '',
    nationality: '',
    applicationDate: '',
    approvalDate: '',
    expiryDate: '',
    certificateNumber: '',
    csocNumber: '',
    bcsscNumber: ''
  });

  const fetchWorker = async () => {
    try {
      const res = await fetch(`https://cmp-ov99.onrender.com/api/workers/${id}`);
      const data = await res.json();
      if (res.ok) {
        setWorker({
          ...data,
          dob: data.dob?.substring(0, 10),
          applicationDate: data.applicationDate?.substring(0, 10),
          approvalDate: data.approvalDate?.substring(0, 10),
          expiryDate: data.expiryDate?.substring(0, 10)
        });
      } else {
        alert(data.message || 'Failed to fetch worker');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching worker data');
    }
  };

  useEffect(() => {
    fetchWorker();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorker((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://cmp-ov99.onrender.com/api/workers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(worker)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Worker updated successfully!');
        navigate('/view-workers');
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating worker');
    }
  };

  return (
    <div className="edit-worker-wrapper">
      <h2>Edit Worker</h2>
      <form onSubmit={handleSubmit} className="edit-worker-form">
        {[
          { label: 'Name', name: 'name' },
          { label: 'Employer', name: 'employer' },
          { label: 'FIN Number', name: 'finNumber' },
          { label: 'Work Permit Number', name: 'workPermitNumber' },
          { label: 'Sector', name: 'sector' },
          { label: 'Nationality', name: 'nationality' },
          { label: 'Certificate Number', name: 'certificateNumber' },
          { label: 'CSOC Number', name: 'csocNumber' },
          { label: 'BCSSC Number', name: 'bcsscNumber' }
        ].map((field) => (
          <div className="form-group" key={field.name}>
            <label>{field.label}</label>
            <input
              type="text"
              name={field.name}
              value={worker[field.name] || ''}
              onChange={handleChange}
            />
          </div>
        ))}

        {[
          { label: 'Date of Birth', name: 'dob' },
          { label: 'Application Date', name: 'applicationDate' },
          { label: 'Approval Date', name: 'approvalDate' },
          { label: 'Expiry Date', name: 'expiryDate' }
        ].map((field) => (
          <div className="form-group" key={field.name}>
            <label>{field.label}</label>
            <input
              type="date"
              name={field.name}
              value={worker[field.name] || ''}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="form-actions">
          <button type="submit" className="save-btn">💾 Save</button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/view-workers')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditWorker;
