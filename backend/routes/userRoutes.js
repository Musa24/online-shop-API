import express from 'express';
const router = express.Router();
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUsers,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { protectRoute, admin } from '../middleware/authMiddleware.js';

router.post('/login', authUser);
router
  .route('/profile')
  .get(protectRoute, getUserProfile)
  .put(protectRoute, updateUserProfile);

router.route('/').post(registerUser).get(protectRoute, admin, getUsers);
router
  .route('/:id')
  .delete(protectRoute, admin, deleteUsers)
  .get(protectRoute, admin, getUserById)
  .put(protectRoute, admin, updateUser);

export default router;
