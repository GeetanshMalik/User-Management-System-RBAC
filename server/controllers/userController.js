const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { logActivity } = require('../utils/activityLogger');

// GET /api/users — Admin & Manager
exports.getUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && ['admin', 'manager', 'user'].includes(role)) {
      filter.role = role;
    }

    if (status && ['active', 'inactive'].includes(status)) {
      filter.status = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email'),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/stats — Dashboard stats
exports.getUserStats = async (req, res, next) => {
  try {
    const [total, active, inactive, roleStats] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ status: 'inactive' }),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]),
    ]);

    const roles = {};
    roleStats.forEach((r) => {
      roles[r._id] = r.count;
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        inactive,
        roles,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/activity — Recent activity logs
exports.getRecentActivity = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const activities = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('performedBy', 'name email role')
      .populate('targetUser', 'name email role');

    // Format activities for frontend
    const formattedActivities = activities.map(activity => ({
      id: activity._id,
      action: activity.action,
      details: activity.details,
      performedBy: activity.performedBy ? {
        name: activity.performedBy.name,
        email: activity.performedBy.email,
        role: activity.performedBy.role
      } : null,
      targetUser: activity.targetUser ? {
        name: activity.targetUser.name,
        email: activity.targetUser.email,
        role: activity.targetUser.role
      } : null,
      timestamp: activity.createdAt,
      timeAgo: getTimeAgo(activity.createdAt)
    }));

    res.status(200).json({
      success: true,
      data: {
        activities: formattedActivities,
        total: activities.length
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' year' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' month' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' day' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hour' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minute' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
  
  return Math.floor(seconds) + ' second' + (Math.floor(seconds) > 1 ? 's' : '') + ' ago';
}

// GET /api/users/:id
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Regular users can only view their own profile
    if (
      req.user.role === 'user' &&
      req.user._id.toString() !== user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own profile.',
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/users — Admin only
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, status } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      status,
      createdBy: req.user._id,
    });

    // Log activity
    await logActivity(
      'user_created',
      req.user._id,
      user._id,
      `User ${user.name} (${user.role}) created by ${req.user.name}`
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Authorization checks
    const isAdmin = req.user.role === 'admin';
    const isManager = req.user.role === 'manager';
    const isOwner = req.user._id.toString() === user._id.toString();

    if (!isAdmin && !isManager && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    // Prevent admin from deactivating themselves
    if (isOwner && user.role === 'admin' && req.body.status === 'inactive') {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own admin account. Ask another admin to do this.',
      });
    }

    // Managers cannot edit admins
    if (isManager && user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Managers cannot edit admin accounts.',
      });
    }

    // Regular users can only update their own profile fields (not role or status)
    if (!isAdmin && !isManager) {
      const allowed = ['name', 'email', 'password', 'phone', 'gender', 'dateOfBirth', 
                       'department', 'jobTitle', 'bio', 'address', 'avatar'];
      Object.keys(req.body).forEach((key) => {
        if (!allowed.includes(key)) {
          delete req.body[key];
        }
      });
    }

    // Managers cannot change roles
    if (isManager && req.body.role) {
      delete req.body.role;
    }

    // Update fields
    Object.keys(req.body).forEach((key) => {
      if (key === 'address' && typeof req.body.address === 'object') {
        // Handle nested address object
        user.address = {
          ...user.address.toObject(),
          ...req.body.address
        };
      } else {
        user[key] = req.body[key];
      }
    });
    user.updatedBy = req.user._id;

    await user.save();

    // Re-fetch to get populated data
    const updatedUser = await User.findById(user._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    // Log activity
    await logActivity(
      'user_updated',
      req.user._id,
      user._id,
      `User ${user.name} updated by ${req.user.name}`
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id — Admin only
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Prevent self-deletion
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account.',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    // Log activity
    await logActivity(
      'user_deleted',
      req.user._id,
      user._id,
      `User ${user.name} deleted by ${req.user.name}`
    );

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id/password — Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Authorization checks
    const isAdmin = req.user.role === 'admin';
    const isOwner = req.user._id.toString() === user._id.toString();

    // Only the user themselves or an admin can change password
    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only change your own password.',
      });
    }

    // If user is changing their own password, verify current password
    if (isOwner && currentPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect.',
        });
      }
    }

    // Admin can change any password without current password
    // But if they're changing their own, they need current password
    if (isOwner && !currentPassword && !isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Current password is required.',
      });
    }

    // Update password
    user.password = newPassword;
    user.updatedBy = req.user._id;
    await user.save();

    // Log activity
    await logActivity(
      'password_changed',
      req.user._id,
      user._id,
      `Password changed for ${user.name}${isOwner ? ' (self)' : ` by ${req.user.name}`}`
    );

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/monthly-stats — Monthly user statistics
exports.getMonthlyStats = async (req, res, next) => {
  try {
    const { months = 6 } = req.query;
    const monthsToFetch = parseInt(months);
    
    // Get current date
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    
    // Calculate start date (X months ago)
    const startDate = new Date(currentYear, currentMonth - monthsToFetch + 1, 1);
    
    // Get all users
    const users = await User.find().select('createdAt status');
    
    // Generate monthly data
    const monthlyData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < monthsToFetch; i++) {
      const monthDate = new Date(currentYear, currentMonth - monthsToFetch + 1 + i, 1);
      const nextMonthDate = new Date(currentYear, currentMonth - monthsToFetch + 2 + i, 1);
      const isCurrentMonth = monthDate.getMonth() === currentMonth && monthDate.getFullYear() === currentYear;
      
      // Count users created up to this month
      const usersUpToThisMonth = users.filter(user => new Date(user.createdAt) < nextMonthDate);
      
      // For current month, use real-time data
      // For past months, calculate what the stats were at the end of that month
      let total, active, inactive;
      
      if (isCurrentMonth) {
        // Current month - use current stats
        total = usersUpToThisMonth.length;
        active = usersUpToThisMonth.filter(u => u.status === 'active').length;
        inactive = total - active;
      } else {
        // Past month - calculate historical stats
        total = usersUpToThisMonth.length;
        // Assume all users were active when created (simplified)
        active = usersUpToThisMonth.filter(u => u.status === 'active').length;
        inactive = total - active;
      }
      
      monthlyData.push({
        month: monthNames[monthDate.getMonth()],
        year: monthDate.getFullYear(),
        total,
        active,
        inactive,
        isCurrent: isCurrentMonth
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        monthlyStats: monthlyData,
        period: `${monthlyData[0].month} ${monthlyData[0].year} - ${monthlyData[monthlyData.length - 1].month} ${monthlyData[monthlyData.length - 1].year}`
      },
    });
  } catch (error) {
    next(error);
  }
};
