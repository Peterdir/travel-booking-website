import * as tourService from '../services/tourService.js';

// [GET] /api/tours
export const getTours = async (req, res) => {
  try {
    const filters = req.query;
    const tours = await tourService.getTours(filters);
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] /api/tours/:id
export const getTourById = async (req, res) => {
  try {
    const tour = await tourService.getTourById(req.params.id);
    res.status(200).json(tour);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// [POST] /api/tours
export const createTour = async (req, res) => {
  try {
    const newTour = await tourService.createTour(req.body);
    res.status(201).json(newTour);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// [PUT] /api/tours/:id
export const updateTour = async (req, res) => {
  try {
    const updatedTour = await tourService.updateTour(req.params.id, req.body);
    res.status(200).json(updatedTour);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// [DELETE] /api/tours/:id
export const deleteTour = async (req, res) => {
  try {
    const deletedTour = await tourService.deleteTour(req.params.id);
    res
      .status(200)
      .json({ message: 'Tour deleted successfully', tour: deletedTour });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
