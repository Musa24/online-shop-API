import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
} from '../controllers/orderController.js';
import { admin, protectRoute } from '../middleware/authMiddleware.js';

router
  .route('/')
  .post(protectRoute, addOrderItems)
  .get(protectRoute, admin, getOrders);
router.route('/myorders').get(protectRoute, getMyOrders);

router.route('/:id').get(protectRoute, getOrderById);
router.route('/:id/pay').put(protectRoute, updateOrderToPaid);
router.route('/:id/deliver').put(protectRoute, admin, updateOrderToDelivered);

export default router;
