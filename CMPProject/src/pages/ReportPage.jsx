import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ReportPage.css';

const ReportPage = () => {
  const [workers, setWorkers] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [finQuery, setFinQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/workers')
      .then(res => res.json())
      .then(data => setWorkers(data))
      .catch(err => console.error("Error fetching workers:", err));
  }, []);

  // 🔄 Dynamically inject @page CSS for print orientation
  useEffect(() => {
    const existing = document.getElementById('dynamic-print-style');
    if (existing) existing.remove();

    const style = document.createElement('style');
    style.id = 'dynamic-print-style';
    style.innerHTML = `
      @media print {
        @page {
          size: ${filterType === 'fin' ? 'portrait' : 'landscape'};
          margin: 1cm;
        }
      }
    `;
    document.head.appendChild(style);
  }, [filterType]);

  const filteredFinSuggestions = workers
    .map(w => w.finNumber)
    .filter(fin => fin.toLowerCase().includes(finQuery.toLowerCase()));

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date)) return '-';
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const filteredByFin = workers.find(w => w.finNumber === selectedValue);
  const filteredByCompany = workers.filter(w => w.employer === selectedValue);
  const expiryThreshold = new Date();
  expiryThreshold.setMonth(expiryThreshold.getMonth() + 3);
  const filteredByExpiry = workers.filter(w => new Date(w.expiryDate) <= expiryThreshold);

  const handlePrint = () => window.print();

  return (
    <div className="report-page">
      <div className="top-bar no-print">
        <button className="back-button" onClick={() => navigate('/')}>🏠 Home</button>
      </div>

      <h2 className="no-print">📊 Worker Reports</h2>

      <div className="filter-section no-print">
        <label>Sort by:</label>
        <select value={filterType} onChange={(e) => {
          setFilterType(e.target.value);
          setSelectedValue('');
        }}>
          <option value="">Select</option>
          <option value="fin">FIN Number</option>
          <option value="company">Company Name</option>
          <option value="expiry">Expiry ≤ 3 Months</option>
        </select>

        {filterType === 'fin' && (
          <>
            <input
              type="text"
              placeholder="Enter FIN Number"
              list="fin-options"
              value={selectedValue}
              onChange={(e) => {
                setSelectedValue(e.target.value);
                setFinQuery(e.target.value);
              }}
            />
            <datalist id="fin-options">
              {filteredFinSuggestions.map((fin, idx) => (
                <option key={idx} value={fin} />
              ))}
            </datalist>
          </>
        )}

        {filterType === 'company' && (
          <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
            <option value="">Select Company</option>
            {[...new Set(workers.map(w => w.employer))].map(company => (
              <option key={company}>{company}</option>
            ))}
          </select>
        )}
      </div>

      {/* ==================== Printable Section ===================== */}
      <div className="print-section">
        {/* Sorted By: Info */}
        {filterType && (
          <div className="print-sort-description" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <strong>Sorted By:</strong>{' '}
            {filterType === 'fin'
              ? `FIN Number (${selectedValue})`
              : filterType === 'company'
              ? `Company Name (${selectedValue})`
              : 'Expiry ≤ 3 Months'}
          </div>
        )}

        {/* FIN View */}
        {filterType === 'fin' && filteredByFin && (
          <div className="report-details-card">
            <div className="detail-grid">
              <div className="worker-name-title"><strong>Name:</strong> {filteredByFin.name || '-'}</div>
              <div></div>
              <div><strong>Employer:</strong> {filteredByFin.employer || '-'}</div>
              <div><strong>FIN No:</strong> {filteredByFin.finNumber || '-'}</div>
              <div><strong>Work Permit:</strong> {filteredByFin.workPermitNumber || '-'}</div>
              <div><strong>DOB:</strong> {formatDate(filteredByFin.dob)}</div>
              <div><strong>Sector:</strong> {filteredByFin.sector || '-'}</div>
              <div><strong>Nationality:</strong> {filteredByFin.nationality || '-'}</div>
              <div><strong>App Date:</strong> {formatDate(filteredByFin.applicationDate)}</div>
              <div><strong>Approval Date:</strong> {formatDate(filteredByFin.approvalDate)}</div>
              <div><strong>Expiry Date:</strong> {formatDate(filteredByFin.expiryDate)}</div>
              <div style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
                <strong>Certificates:</strong> {filteredByFin.certificates || '-'}
              </div>

              <div><strong>Type:</strong> {filteredByFin.certificateType || '-'}</div>
              <div><strong>CSOC No:</strong> {filteredByFin.csocNumber || '-'}</div>
              <div><strong>CSOC Date:</strong> {formatDate(filteredByFin.csocDate)}</div>
              <div><strong>BCSS No:</strong> {filteredByFin.bcssNumber || '-'}</div>
            </div>
          </div>
        )}

        {/* Table View: Company or Expiry */}
        {(filterType === 'company' && selectedValue) || filterType === 'expiry' ? (
          <div className="print-table-centered">
            <table className="worker-table">
              <thead>
                <tr>
                  <th>Name</th><th>Employer</th><th>FIN No</th><th>Work Permit</th><th>DOB</th><th>Sector</th>
                  <th>Nationality</th><th>App Date</th><th>Approval Date</th><th>Expiry Date</th>
                  <th>Certificates</th><th>Type</th><th>CSOC No</th><th>CSOC Date</th><th>BCSS No</th>
                </tr>
              </thead>
              <tbody>
                {(filterType === 'company' ? filteredByCompany : filteredByExpiry).map((w, idx) => (
                  <tr key={idx}>
                  <td>{w.name || '-'}</td>
                  <td>{w.employer || '-'}</td>
                  <td>{w.finNumber || '-'}</td>
                  <td>{w.workPermitNumber || '-'}</td>
                  <td>{formatDate(w.dob)}</td>
                  <td>{w.sector || '-'}</td>
                  <td>{w.nationality || '-'}</td>
                  <td>{formatDate(w.applicationDate)}</td>
                  <td>{formatDate(w.approvalDate)}</td>
                  <td>{formatDate(w.expiryDate)}</td>
                  <td style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
                    {w.certificates || '-'}
                  </td>
                  <td>{w.certificateType || '-'}</td>
                  <td>{w.csocNumber || '-'}</td>
                  <td>{formatDate(w.csocDate)}</td>
                  <td>{w.bcssNumber || '-'}</td>
                </tr>                
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      {/* ========== Print Button ========== */}
      {(
        (filterType === 'fin' && filteredByFin) ||
        (filterType === 'company' && filteredByCompany.length > 0) ||
        (filterType === 'expiry' && filteredByExpiry.length > 0)
      ) && (
        <div className="no-print bottom-button-wrapper">
          <button className="print-button" onClick={handlePrint}>🖨️ Print</button>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
