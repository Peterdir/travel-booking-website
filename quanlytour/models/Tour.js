// server/src/models/Tour.js
const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  coverImage: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },              // Giá tour / người
  location: { type: String, index: true, required: true },      // Địa điểm
  days: { type: Number, required: true, min: 1 },               // Số ngày
  startDates: [{ type: Date, required: true }],                 // Lịch khởi hành
  maxGuests: { type: Number, required: true, min: 1 },          // Giới hạn số người
  description: { type: String },
  isActive: { type: Boolean, default: true },

  // để khoá chỗ an toàn: còn lại bao nhiêu ghế cho từng ngày
  availability: [{
    startDate: { type: Date, required: true, index: true },
    remaining: { type: Number, required: true, min: 0 }
  }],
}, { timestamps: true });

TourSchema.index({ price: 1 });
TourSchema.index({ days: 1 });
TourSchema.index({ isActive: 1 });

module.exports = mongoose.model('Tour', TourSchema);
