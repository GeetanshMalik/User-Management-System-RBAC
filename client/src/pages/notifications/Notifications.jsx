import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Filter, UserPlus, UserMinus, UserCheck, Key, AlertCircle } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refreshNotifications,
    preferences,
  } = useNotifications();
  
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Refresh notifications when component mounts
    if (preferences.push) {
      refreshNotifications();
    }
  }, []);

  // Show message if push notifications are disabled
  if (!preferences.push) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your notifications</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <Bell className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Push Notifications Disabled</h3>
          <p className="text-sm text-gray-600 mb-4">
            You have disabled push notifications in your settings. Enable them to receive real-time updates.
          </p>
          <a
            href="/settings"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Settings
          </a>
        </div>
      </div>
    );
  }

  const getNotificationIcon = (type) => {
    const icons = {
      user_created: UserPlus,
      user_updated: UserCheck,
      user_deleted: UserMinus,
      user_login: Key,
      password_changed: Key,
      info: AlertCircle,
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type) => {
    const colors = {
      user_created: 'bg-green-100 text-green-600',
      user_updated: 'bg-blue-100 text-blue-600',
      user_deleted: 'bg-red-100 text-red-600',
      user_login: 'bg-purple-100 text-purple-600',
      password_changed: 'bg-yellow-100 text-yellow-600',
      info: 'bg-gray-100 text-gray-600',
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2 border border-indigo-200"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 border border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          {[
            { value: 'all', label: 'All' },
            { value: 'unread', label: 'Unread' },
            { value: 'user_created', label: 'User Created' },
            { value: 'user_updated', label: 'User Updated' },
            { value: 'user_deleted', label: 'User Deleted' },
            { value: 'user_login', label: 'Logins' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === f.value
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type);
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{notification.title}</h3>
                          {!notification.read && (
                            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2"></span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{notification.timeAgo}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>User: {notification.user}</span>
                        <span>•</span>
                        <span>By: {notification.by}</span>
                        <span>•</span>
                        <span>{new Date(notification.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications to display</p>
            <p className="text-sm text-gray-400 mt-1">
              {filter !== 'all' ? 'Try changing your filter' : 'You\'re all caught up!'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3"
      >
        <Bell className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-indigo-900 font-medium">Real-time Updates</p>
          <p className="text-sm text-indigo-700 mt-1">
            Notifications are automatically refreshed every 30 seconds. You can also configure notification
            preferences in Settings.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Notifications;
