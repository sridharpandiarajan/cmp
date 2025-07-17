const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employer: { type: String },
  workPermitNumber: { type: String },
  sector: { type: String },
  finNumber: { type: String, required: true, unique: true },
  dob: { type: Date }, // Changed to Date
  nationality: { type: String },
  applicationDate: { type: Date },
  approvalDate: { type: Date },
  expiryDate: { type: Date },
  certificates: { type: String },
  certificateType: { type: String },
  csocNumber: { type: String },
  csocDate: { type: Date },
  bcssNumber: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Worker', WorkerSchema);
