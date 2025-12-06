import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, bookingController.createBooking);

router.get('/', protect, bookingController.getBookings);

router.get('/:id', protect, bookingController.getBookingById);

router.put('/:id', protect, bookingController.updateBooking);

router.delete('/:id', protect, adminOnly, bookingController.deleteBooking);

export default router;