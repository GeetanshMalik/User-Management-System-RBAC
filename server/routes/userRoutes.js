const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  getRecentActivity,
  changePassword,
  getMonthlyStats,
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const { validate, createUserSchema, updateUserSchema, changePasswordSchema } = require('../validators/userValidator');

// All routes require authentication
router.use(auth);

// Stats and activity routes
router.get('/stats', getUserStats); // Allow all authenticated users
router.get('/activity', authorize('admin', 'manager'), getRecentActivity);
router.get('/monthly-stats', authorize('admin', 'manager'), getMonthlyStats);

// Change password route
router.put('/:id/password', validate(changePasswordSchema), changePassword);

// CRUD routes
router.get('/', authorize('admin', 'manager'), getUsers);
router.post('/', authorize('admin'), validate(createUserSchema), createUser);
router.get('/:id', getUserById);
router.put('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
