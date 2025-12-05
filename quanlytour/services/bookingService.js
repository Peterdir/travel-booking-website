// server/src/services/bookingService.js
import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';

/**
 * Lấy tất cả booking hoặc lọc theo điều kiện
 */
export const getBookings = async (filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.tour) query.tour = filters.tour;
  if (filters.startDate) query.startDate = filters.startDate;

  const bookings = await Booking.find(query)
    .populate('tour')
    .sort({ createdAt: -1 });

  return bookings;
};

/**
 * Lấy booking theo ID
 */
export const getBookingById = async (id) => {
  const booking = await Booking.findById(id).populate('tour');
  if (!booking) throw new Error('Booking not found');
  return booking;
};

/**
 * Tạo booking mới
 */
export const createBooking = async (bookingData) => {
  const tour = await Tour.findById(bookingData.tour);
  if (!tour) throw new Error('Tour not found');

  const unitPrice = tour.price;
  const totalPrice = unitPrice * bookingData.partySize;
  const startDate = new Date(bookingData.startDate);

  const dateAvailability = tour.availability?.find(
    (avail) => new Date(avail.startDate).getTime() === startDate.getTime()
  );

  if (dateAvailability) {
    if (dateAvailability.remaining < bookingData.partySize) {
      throw new Error('Not enough available spots for the selected date');
    }
    dateAvailability.remaining -= bookingData.partySize;
  } else {
    console.warn('No availability record found for this start date');
  }

  const newBooking = new Booking({
    ...bookingData,
    unitPrice,
    totalPrice,
  });

  await newBooking.save();
  if (dateAvailability) await tour.save();

  return newBooking;
};

/**
 * Cập nhật booking theo ID
 */
export const updateBooking = async (id, bookingData) => {
  const updatedBooking = await Booking.findByIdAndUpdate(id, bookingData, {
    new: true,
  });
  if (!updatedBooking) throw new Error('Booking not found');
  return updatedBooking;
};

/**
 * Xóa booking theo ID
 */
export const deleteBooking = async (id) => {
  const deletedBooking = await Booking.findByIdAndDelete(id);
  if (!deletedBooking) throw new Error('Booking not found');
  return deletedBooking;
};
