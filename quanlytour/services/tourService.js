// server/src/services/tourService.js
import Tour from '../models/Tour.js';

export const getTours = async (filters) => {
  const query = {};

  if (filters.location) query.location = new RegExp(filters.location, 'i');
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }
  if (filters.days) query.days = Number(filters.days);
  if (filters.isActive !== undefined) query.isActive = filters.isActive;

  return await Tour.find(query);
};

export const getTourById = async (id) => {
  const tour = await Tour.findById(id);
  if (!tour) throw new Error('Tour not found');
  return tour;
};

export const createTour = async (data) => {
  const tour = new Tour(data);
  await tour.save();
  return tour;
};

export const updateTour = async (id, data) => {
  const updated = await Tour.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw new Error('Tour not found');
  return updated;
};

export const deleteTour = async (id) => {
  const deleted = await Tour.findByIdAndDelete(id);
  if (!deleted) throw new Error('Tour not found');
  return deleted;
};
