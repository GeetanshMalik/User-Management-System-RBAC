import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Shield,
  CheckCircle,
  Calendar,
  User as UserIcon,
  Edit,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';
import UserFormModal from '../../components/users/UserFormModal';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const { data } = await api.get(`/users/${id}`);
      setUser(data.data.user); // Backend returns data.data.user
    } catch (error) {
      console.error('Failed to fetch user:', error);
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdated = () => {
    setShowEditModal(false);
    fetchUser(); // Refetch user data after update
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'badge-danger';
      case 'manager': return 'badge-info';
      case 'user': return 'badge-success';
      default: return 'badge-gray';
    }
  };

  const getStatusBadgeColor = (status) => {
    return status === 'active' ? 'badge-success' : 'badge-gray';
  };

  const canEdit = () => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'manager' && user?.role !== 'admin') return true;
    return false;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">User not found</p>
        <Link to="/users" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-4 inline-block">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/users')}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Details</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">View account information and audit details</p>
          </div>
        </div>
        {canEdit() && (
          <button
            onClick={() => setShowEditModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit User
          </button>
        )}
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-xl shadow-sm border border-blue-800 p-8"
      >
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <p className="text-gray-300">{user.email}</p>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className={getRoleBadgeColor(user.role)}>
                  {user.role.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-400" />
                <span className={getStatusBadgeColor(user.status)}>
                  {user.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Account Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          Account Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Full Name</p>
            <p className="text-base text-white">{user.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Email Address</p>
            <p className="text-base text-white">{user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Role</p>
            <span className={getRoleBadgeColor(user.role)}>
              {user.role.toUpperCase()}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Account Status</p>
            <span className={getStatusBadgeColor(user.status)}>
              {user.status.toUpperCase()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Audit Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Audit Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Created At</p>
            <p className="text-base text-white">{formatDate(user.createdAt)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">Updated At</p>
            <p className="text-base text-white">{formatDate(user.updatedAt)}</p>
          </div>
          {user.createdBy && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-400">Created By</p>
              <p className="text-base text-white">{user.createdBy.name || 'System'}</p>
            </div>
          )}
          {user.updatedBy && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-400">Updated By</p>
              <p className="text-base text-white">{user.updatedBy.name || 'System'}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link to="/users" className="btn-secondary">
          Back to Users
        </Link>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <UserFormModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            fetchUser();
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
};

export default UserDetail;
