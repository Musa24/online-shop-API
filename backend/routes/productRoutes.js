import express from 'express';
const router = express.Router();
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  getTopProducts,
  costCalculator,
} from '../controllers/productController.js';
import { protectRoute, admin } from '../middleware/authMiddleware.js';

// router.get('/', getProducts);

router.route('/').get(getProducts).post(protectRoute, admin, createProduct);
router.get('/top', getTopProducts);
router
  .route('/:id')
  .get(getProductById)
  .delete(protectRoute, admin, deleteProduct)
  .put(protectRoute, admin, updateProduct);
router.route('/:id/reviews').post(protectRoute, createProductReview);

export default router;
