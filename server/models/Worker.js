const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
  name: String,
  employer: String,
  workPermitNumber: String,
  sector: String,
  finNumber: String,
  dob: String,
  nationality: String,
  applicationDate: String,
  approvalDate: String,
  expiryDate: String,
  certificates: String,
  certificateType: String,
  csocNumber: String,
  csocDate: String,
  bcssNumber: String
}, { timestamps: true });

module.exports = mongoose.model('Worker', WorkerSchema);
