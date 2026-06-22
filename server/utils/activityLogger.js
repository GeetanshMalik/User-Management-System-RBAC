const ActivityLog = require('../models/ActivityLog');

/**
 * Log user activity
 * @param {String} action - Action type (user_created, user_updated, etc.)
 * @param {ObjectId} performedBy - User who performed the action
 * @param {ObjectId} targetUser - User affected by the action (optional)
 * @param {String} details - Human-readable description
 * @param {Object} metadata - Additional data (optional)
 */
const logActivity = async (action, performedBy, targetUser = null, details = '', metadata = {}) => {
  try {
    await ActivityLog.create({
      action,
      performedBy,
      targetUser,
      details,
      metadata,
    });
  } catch (error) {
    // Don't throw error - activity logging should not break the main flow
    console.error('Failed to log activity:', error.message);
  }
};

module.exports = { logActivity };
