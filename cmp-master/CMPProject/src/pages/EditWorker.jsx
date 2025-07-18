import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../css/EditWorker.css';

const EditWorker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://cmp-backend-8htv.onrender.com/${id}`)
      .then(res => res.json())
      .then(data => {
        setWorker(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch worker:', err);
        toast.error('❌ Failed to load worker');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorker({ ...worker, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://cmp-backend-8htv.onrender.com/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(worker),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error("🚨 Non-JSON response received:", text);
        throw new Error("Server returned non-JSON response. Check route or server error.");
      }

      const data = await res.json();

      if (res.ok) {
        toast.success('✅ Worker updated successfully');
        navigate('/view');
      } else {
        toast.error('❌ Failed to update: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Submission error:', error);
      toast.error('❌ Network/server error. Please check backend is running.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!worker) return <p>Worker not found.</p>;

  return (
    <div className="edit-worker-page">
      <h2>✏️ Edit Worker</h2>
      <form onSubmit={handleSubmit} className="edit-worker-form">
        <label>Name:<input name="name" value={worker.name || ''} onChange={handleChange} /></label>
        <label>Employer:<input name="employer" value={worker.employer || ''} onChange={handleChange} /></label>
        <label>FIN No:<input name="finNumber" value={worker.finNumber || ''} onChange={handleChange} /></label>
        <label>Work Permit:<input name="workPermitNumber" value={worker.workPermitNumber || ''} onChange={handleChange} /></label>
        <label>DOB:<input type="date" name="dob" value={worker.dob?.slice(0, 10) || ''} onChange={handleChange} /></label>
        <label>Sector:<input name="sector" value={worker.sector || ''} onChange={handleChange} /></label>
        <label>Nationality:<input name="nationality" value={worker.nationality || ''} onChange={handleChange} /></label>
        <label>Application Date:<input type="date" name="applicationDate" value={worker.applicationDate?.slice(0, 10) || ''} onChange={handleChange} /></label>
        <label>Approval Date:<input type="date" name="approvalDate" value={worker.approvalDate?.slice(0, 10) || ''} onChange={handleChange} /></label>
        <label>Expiry Date:<input type="date" name="expiryDate" value={worker.expiryDate?.slice(0, 10) || ''} onChange={handleChange} /></label>
        <label>Certificates:<input name="certificates" value={worker.certificates || ''} onChange={handleChange} /></label>

        <label>Certificate Type:
          <select name="certificateType" value={worker.certificateType || ''} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="CSOC">CSOC</option>
            <option value="BCSS">BCSS</option>
          </select>
        </label>

        {worker.certificateType === 'CSOC' && (
          <>
            <label>CSOC No:<input name="csocNumber" value={worker.csocNumber || ''} onChange={handleChange} /></label>
            <label>CSOC Date:<input type="date" name="csocDate" value={worker.csocDate?.slice(0, 10) || ''} onChange={handleChange} /></label>
          </>
        )}

        {worker.certificateType === 'BCSS' && (
          <label>BCSS No:<input name="bcssNumber" value={worker.bcssNumber || ''} onChange={handleChange} /></label>
        )}

        <button type="submit" className="save-btn">💾 Save Changes</button>
        <button type="button" className="cancel-btn" onClick={() => navigate('/view')}>❌ Cancel</button>
      </form>
    </div>
  );
};

export default EditWorker;
