import * as bookingService from '../services/bookingService.js'; 

// [GET] /api/bookings
export const getBookings = async (req, res) => {
  try {
    console.log('Query parameters:', req.query);
    const filters = req.query;
    const bookings = await bookingService.getBookings(filters);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] /api/bookings/:id
export const getBookingById = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [POST] /api/bookings
export const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    const newBooking = await bookingService.createBooking(bookingData);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// [PUT] /api/bookings/:id
export const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await bookingService.updateBooking(
      req.params.id,
      req.body
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [DELETE] /api/bookings/:id
export const deleteBooking = async (req, res) => {
  try {
    await bookingService.deleteBooking(req.params.id);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};