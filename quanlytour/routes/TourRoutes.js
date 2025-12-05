import express from 'express';
import * as tourController from '../controllers/tourController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', tourController.getTours);
router.get('/:id', tourController.getTourById);

// Admin-only
router.post('/', protect, adminOnly, tourController.createTour);
router.put('/:id', protect, adminOnly, tourController.updateTour);
router.delete('/:id', protect, adminOnly, tourController.deleteTour);

export default router;
