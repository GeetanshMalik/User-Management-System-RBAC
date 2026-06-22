import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  Trash2,
  AlertTriangle,
  Save,
  Database,
  Mail,
  Globe,
  X,
  Check,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../contexts/NotificationContext';
import api from '../../utils/api';

const Settings = () => {
  const { user, logout } = useAuth();
  const { preferences, updatePreferences } = useNotifications();
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState(preferences);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      updatePreferences(notifications);
      showToast('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showToast('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableAccount = async () => {
    try {
      const userId = user._id || user.id;
      await api.put(`/users/${userId}`, { status: 'inactive' });
      setShowDisableModal(false);
      showToast('Account disabled successfully', 'success');
      setTimeout(() => {
        logout();
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Failed to disable account:', error);
      showToast('Failed to disable account', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userId = user._id || user.id;
      await api.delete(`/users/${userId}`);
      setShowDeleteModal(false);
      showToast('Account deleted successfully', 'success');
      setTimeout(() => {
        logout();
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Failed to delete account:', error);
      showToast('Failed to delete account', 'error');
    }
  };

  const handleComingSoon = (feature) => {
    showToast(`${feature} - Coming Soon!`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-4 left-1/2 z-50 min-w-[300px]"
          >
            <div className={`rounded-lg shadow-lg p-4 flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-green-900/90 border border-green-700' :
              toast.type === 'error' ? 'bg-red-900/90 border border-red-700' :
              'bg-blue-900/90 border border-blue-700'
            }`}>
              {toast.type === 'success' && <Check className="w-5 h-5 text-green-400" />}
              {toast.type === 'error' && <X className="w-5 h-5 text-red-400" />}
              {toast.type === 'info' && <Bell className="w-5 h-5 text-blue-400" />}
              <span className="text-sm font-medium text-white">
                {toast.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your account preferences and system settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="space-y-3">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'general'
                ? 'bg-indigo-900/50 border-2 border-indigo-600 text-indigo-400 font-medium'
                : 'border-2 border-gray-700 text-gray-300 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-5 h-5" />
              <span>General</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'notifications'
                ? 'bg-indigo-900/50 border-2 border-indigo-600 text-indigo-400 font-medium'
                : 'border-2 border-gray-700 text-gray-300 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'security'
                ? 'bg-indigo-900/50 border-2 border-indigo-600 text-indigo-400 font-medium'
                : 'border-2 border-gray-700 text-gray-300 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5" />
              <span>Privacy & Security</span>
            </div>
          </button>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <>
              {/* System Settings (Admin Only) */}
              {user?.role === 'admin' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Database className="w-5 h-5 text-gray-400" />
                    <h2 className="text-lg font-semibold text-white">System Settings</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-white">Email Server</p>
                            <p className="text-xs text-gray-400">Configure SMTP settings</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleComingSoon('Email Server Configuration')}
                          className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          Configure
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-white">Domain Settings</p>
                            <p className="text-xs text-gray-400">Manage custom domain</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleComingSoon('Domain Settings')}
                          className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          Configure
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Database className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-white">Database Backup</p>
                            <p className="text-xs text-gray-400">Last backup: 2 hours ago</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleComingSoon('Database Backup')}
                          className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          Backup Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Info Message for Non-Admins */}
              {user?.role !== 'admin' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6"
                >
                  <div className="text-center py-8">
                    <SettingsIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">General Settings</h3>
                    <p className="text-sm text-gray-400">
                      Manage your notification preferences and account security in the tabs above.
                    </p>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
              </div>
              <div className="space-y-4">
                {[
                  { key: 'push', label: 'Push Notifications', description: 'Receive browser push notifications', enabled: true },
                  { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email', enabled: false, comingSoon: true },
                  { key: 'activityAlerts', label: 'Activity Alerts', description: 'Get notified about important activities', enabled: false, comingSoon: true },
                  { key: 'weeklyReport', label: 'Weekly Report', description: 'Receive weekly summary reports', enabled: false, comingSoon: true },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        {item.comingSoon && (
                          <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded-full font-medium border border-blue-700">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                    </div>
                    {item.enabled ? (
                      <button
                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications[item.key] ? 'bg-indigo-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleComingSoon(item.label)}
                        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Enable
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl shadow-sm border border-red-900/50 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-red-900/20 rounded-lg border border-red-900/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-400">Disable Account</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Temporarily disable your account. You can reactivate it anytime.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDisableModal(true)}
                      className="px-4 py-2 text-sm bg-yellow-900/50 text-yellow-400 rounded-lg hover:bg-yellow-900/70 transition-colors font-medium border border-yellow-700"
                    >
                      Disable
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-red-900/20 rounded-lg border border-red-900/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-400">Delete Account</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Permanently delete your account and all data. This action cannot be undone.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Disable Account Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-900/50 rounded-full flex items-center justify-center border border-yellow-700">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Disable Account?</h3>
                <p className="text-sm text-gray-400">You can reactivate it later</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-6">
              Your account will be temporarily disabled. You won't be able to log in until an admin reactivates it.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDisableModal(false)}
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDisableAccount}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Disable Account
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center border border-red-700">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Delete Account?</h3>
                <p className="text-sm text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-6">
              All your data will be permanently deleted. This includes your profile, activity history, and all associated information.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;
