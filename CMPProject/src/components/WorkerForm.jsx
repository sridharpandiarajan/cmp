import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/WorkerForm.css';

const WorkerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    employer: '',
    workPermitNumber: '',
    sector: '',
    finNumber: '',
    dob: '',
    nationality: '',
    applicationDate: '',
    approvalDate: '',
    expiryDate: '',
    certificates: '',
    certificateType: '',
    csocNumber: '',
    csocDate: '',
    bcssNumber: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clean unused fields based on certificate type
    const finalData = { ...formData };
    if (finalData.certificateType === 'CSOC') {
      finalData.bcssNumber = '';
    } else if (finalData.certificateType === 'BCSS') {
      finalData.csocNumber = '';
      finalData.csocDate = '';
    }

    console.log("📤 Submitting worker:", finalData);

    try {
      const response = await fetch('http://localhost:5000/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error("🚨 Non-JSON response received:", text);
        throw new Error("Server returned non-JSON response. Check route or server error.");
      }

      const data = await response.json();

      if (response.ok) {
        toast.success("✅ Worker record saved!");
        setFormData({
          name: '',
          employer: '',
          workPermitNumber: '',
          sector: '',
          finNumber: '',
          dob: '',
          nationality: '',
          applicationDate: '',
          approvalDate: '',
          expiryDate: '',
          certificates: '',
          certificateType: '',
          csocNumber: '',
          csocDate: '',
          bcssNumber: ''
        });
      } else {
        toast.error('❌ Failed to save worker: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('⚠️ Error during submission:', error);
      toast.error('⚠️ Error during submission: ' + error.message);
    }
  };

  return (
    <div className="wrapper">
      <div className="worker-form-container">
        <div className="top-bar">
          <button className="dashboard-btn" onClick={() => navigate('/')}>
            🏠 Home
          </button>
        </div>

        <form className="worker-form" onSubmit={handleSubmit}>
          <h2>Worker Details</h2>

          {[['Name', 'name'], ['Employer', 'employer'], ['Work Permit Number', 'workPermitNumber'], ['Sector', 'sector'], ['FIN Number', 'finNumber']].map(([label, name]) => (
            <div className="form-group" key={name}>
              <label>{label}</label>
              <input type="text" name={name} value={formData[name]} onChange={handleChange} required />
            </div>
          ))}

          {[['Date of Birth', 'dob'], ['Date of Application', 'applicationDate'], ['Date of Approval', 'approvalDate'], ['Date of Expiry', 'expiryDate']].map(([label, name]) => (
            <div className="form-group" key={name}>
              <label>{label}</label>
              <input type="date" name={name} value={formData[name]} onChange={handleChange} required />
            </div>
          ))}

          <div className="form-group">
            <label>Nationality</label>
            <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Certificates</label>
            <textarea name="certificates" value={formData.certificates} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Certificate Type</label>
            <select name="certificateType" value={formData.certificateType} onChange={handleChange} required>
              <option value="">Select Certificate Type</option>
              <option value="CSOC">CSOC</option>
              <option value="BCSS">BCSS</option>
            </select>
          </div>

          {formData.certificateType === 'CSOC' && (
            <>
              <div className="form-group">
                <label>CSOC Number</label>
                <input type="text" name="csocNumber" value={formData.csocNumber} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Date of CSOC</label>
                <input type="date" name="csocDate" value={formData.csocDate} onChange={handleChange} required />
              </div>
            </>
          )}

          {formData.certificateType === 'BCSS' && (
            <div className="form-group">
              <label>BCSS Number</label>
              <input
                type="text"
                name="bcssNumber"
                value={formData.bcssNumber}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit">Submit</button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default WorkerForm;
