import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem('readNotifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [clearedIds, setClearedIds] = useState(() => {
    const saved = localStorage.getItem('clearedNotifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('notificationPreferences');
    return saved ? JSON.parse(saved) : {
      email: true,
      push: true,
      activityAlerts: true,
      weeklyReport: false,
    };
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated and update when token changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    
    checkAuth();
    
    // Listen for storage changes (when token is added/removed)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Don't fetch on mount - let components fetch when needed
  // This prevents 401 errors when user is not authenticated

  useEffect(() => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('readNotifications', JSON.stringify(readIds));
  }, [readIds]);

  useEffect(() => {
    localStorage.setItem('clearedNotifications', JSON.stringify(clearedIds));
  }, [clearedIds]);

  const fetchNotifications = async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      return;
    }

    try {
      // Only fetch if push notifications are enabled
      if (!preferences.push) {
        return;
      }

      const { data } = await api.get('/users/activity?limit=20');
      
      const notifs = data.data.activities
        .filter(activity => !clearedIds.includes(activity.id))
        .map(activity => ({
          id: activity.id,
          type: getNotificationType(activity.action),
          title: getNotificationTitle(activity.action),
          message: activity.details,
          user: activity.targetUser?.name || 'Unknown',
          by: activity.performedBy?.name || 'System',
          timestamp: activity.timestamp,
          timeAgo: activity.timeAgo,
          read: readIds.includes(activity.id),
          action: activity.action,
        }));
      
      setNotifications(notifs);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Don't throw error, just log it
    }
  };

  const getNotificationType = (action) => {
    if (action.includes('created')) return 'user_created';
    if (action.includes('updated')) return 'user_updated';
    if (action.includes('deleted')) return 'user_deleted';
    if (action.includes('login')) return 'user_login';
    if (action.includes('password')) return 'password_changed';
    return 'info';
  };

  const getNotificationTitle = (action) => {
    const titles = {
      user_created: 'New User Created',
      user_updated: 'User Updated',
      user_deleted: 'User Deleted',
      user_login: 'User Login',
      password_changed: 'Password Changed',
      status_changed: 'Status Changed',
    };
    return titles[action] || 'System Notification';
  };

  const markAsRead = (id) => {
    setReadIds(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(prev => {
      const newIds = allIds.filter(id => !prev.includes(id));
      return [...prev, ...newIds];
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setClearedIds(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const clearAll = () => {
    const allIds = notifications.map(n => n.id);
    setClearedIds(prev => {
      const newIds = allIds.filter(id => !prev.includes(id));
      return [...prev, ...newIds];
    });
    setNotifications([]);
  };

  const updatePreferences = (newPreferences) => {
    setPreferences(newPreferences);
    
    // If push notifications are disabled, clear all notifications
    if (!newPreferences.push) {
      setNotifications([]);
    }
    // Don't auto-fetch here - let the component that needs it call refreshNotifications
  };

  const refreshNotifications = () => {
    // Manual refresh function that can be called after user actions
    // Only fetch if authenticated and push notifications enabled
    if (isAuthenticated && preferences.push) {
      fetchNotifications();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    preferences,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    updatePreferences,
    refreshNotifications,
    fetchNotifications,
    isAuthenticated,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
