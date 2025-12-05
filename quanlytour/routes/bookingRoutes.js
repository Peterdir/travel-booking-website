import express from 'express';
import * as bookingController from '../controllers/bookingController.js';

const router = express.Router();

// CRUD routes
router.post('/', bookingController.createBooking); // Tạo booking mới
router.get('/', bookingController.getBookings); // Lấy danh sách booking
router.get('/:id', bookingController.getBookingById); // Lấy booking theo ID
router.put('/:id', bookingController.updateBooking); // Cập nhật booking theo ID
router.delete('/:id', bookingController.deleteBooking); // Xóa booking theo ID

export default router;