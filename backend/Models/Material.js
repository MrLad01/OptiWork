const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  material_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true },
  supplier_name: { type: String, required: true },
  supplier_contact: { type: String, required: true },
  purchase_date: { type: Date, required: true },
  expiration_date: { type: Date, required: true },
  storage_location: { type: String, required: true },
  material_type: { type: String, required: true },
  weight: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
