import express from 'express';
import { deleteUser, getAllUsers, getUserById } from '../controllers/users.controlller';
import { adminProtected, userProtected } from '../middlewares/auth.middleware';

const router = express.Router();

// Get All Users (admin only)
router.get('/', userProtected, adminProtected, getAllUsers);

// Get user by ID (admin only)
router.get('/:id', userProtected, adminProtected, getUserById);

// Delete user by ID (admin only)
router.delete('/:id', userProtected, adminProtected, deleteUser);



export default router;