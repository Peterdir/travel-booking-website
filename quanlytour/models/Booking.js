// server/src/models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true, index: true },
  startDate: { type: Date, required: true, index: true },
  customer: {
    fullName: { type: String, required: true },
    email:    { type: String, required: true },
    phone:    { type: String, required: true }
  },
  partySize: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 }, // snapshot giá tại thời điểm đặt
  totalPrice:{ type: Number, required: true, min: 0 },
  status: { type: String, enum: ['unpaid','paid','cancelled'], default: 'unpaid', index: true },
}, { timestamps: true });

BookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', BookingSchema);
