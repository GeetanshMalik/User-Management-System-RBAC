import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../contexts/NotificationContext';
import api from '../../utils/api';

const UserFormModal = ({ user, onClose, onSuccess }) => {
  const { user: currentUser } = useAuth();
  const { refreshNotifications } = useNotifications();
  const isEdit = !!user;
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    status: user?.status || 'active',
    password: '',
    autoGeneratePassword: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!isEdit && !formData.autoGeneratePassword && !formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const canEditRole = () => {
    return currentUser.role === 'admin';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prevent admin from deactivating themselves
    if (isEdit && user.role === 'admin' && currentUser._id === user._id && formData.status === 'inactive') {
      setErrors({ api: 'You cannot deactivate your own admin account. Ask another admin to do this.' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status
      };

      if (!isEdit) {
        if (formData.autoGeneratePassword) {
          payload.password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        } else {
          payload.password = formData.password;
        }
      } else if (formData.password) {
        payload.password = formData.password;
      }

      if (isEdit) {
        await api.put(`/users/${user._id}`, payload);
      } else {
        await api.post('/users', payload);
      }

      // Refresh notifications after user action
      setTimeout(() => refreshNotifications(), 1000);
      
      onSuccess();
    } catch (error) {
      setErrors({ api: error.response?.data?.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEdit ? 'Edit User' : 'Create New User'}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {isEdit ? 'Update account details and permissions' : 'Add a new account and assign access level'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errors.api && (
              <div
                className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800"
              >
                {errors.api}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg input-focus ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p
                    className="text-xs text-red-600"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg input-focus ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p
                    className="text-xs text-red-600"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={!canEditRole()}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg input-focus appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg input-focus appearance-none bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password Section */}
            {!isEdit && (
              <div className="space-y-3 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoGeneratePassword"
                    name="autoGeneratePassword"
                    checked={formData.autoGeneratePassword}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="autoGeneratePassword" className="text-sm font-medium text-gray-700">
                    Auto-generate password
                  </label>
                </div>

                {!formData.autoGeneratePassword && (
                  <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className={`w-full pl-4 pr-12 py-2.5 border rounded-lg input-focus ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p
                        className="text-xs text-red-600"
                      >
                        {errors.password}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {isEdit && (
              <div className="space-y-1.5 pt-2 border-t border-gray-200">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password (leave blank to keep current)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg input-focus"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 btn-primary flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isEdit ? 'Saving...' : 'Creating...'}</span>
                  </>
                ) : (
                  <span>{isEdit ? 'Save Changes' : 'Create User'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default UserFormModal;
