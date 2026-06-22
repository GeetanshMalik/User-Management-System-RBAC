import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Shield, CheckCircle, ArrowRight, Phone, MapPin, Briefcase, Calendar, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';

const UserDashboard = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await api.get(`/users/${authUser.id}`);
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      setUser(authUser);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 border border-red-200';
      case 'manager': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'user': return 'bg-green-100 text-green-700 border border-green-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getStatusBadgeColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700 border border-green-200' 
      : 'bg-gray-100 text-gray-700 border border-gray-200';
  };

  const getDefaultAvatar = (gender) => {
    if (gender === 'male') return '/avatars/boy-avatar.svg';
    if (gender === 'female') return '/avatars/girl-avatar.svg';
    return null;
  };

  const userAvatar = user?.avatar || getDefaultAvatar(user?.gender);

  const formatDate = (date) => {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{getGreeting()}, {user?.name}!</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Welcome back to your dashboard</p>
      </div>

      {/* Profile Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 p-8"
      >
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
            {userAvatar ? (
              <img src={userAvatar} alt={user?.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <p className="text-gray-700 dark:text-gray-300">{user?.email}</p>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(user?.status)}`}>
                  {user?.status?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/profile"
            className="group p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">View Profile</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">See your account details</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
          </Link>
          <Link
            to="/profile"
            className="group p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Update Profile</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Edit your information</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Account Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 py-2">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block">Full Name</span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">{user?.name || 'Not provided'}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block">Email Address</span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">{user?.email}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block">Phone</span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">{user?.phone || 'Not provided'}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block">Date of Birth</span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">{formatDate(user?.dateOfBirth)}</span>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 py-2">
              <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block">Job Title</span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">{user?.jobTitle || 'Not provided'}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block">Department</span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">{user?.department || 'Not provided'}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block">Location</span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">
                  {user?.address?.city && user?.address?.country 
                    ? `${user.address.city}, ${user.address.country}`
                    : 'Not provided'}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block">Role</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {user?.bio && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">Bio</span>
            <p className="text-sm text-gray-900 dark:text-white">{user.bio}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserDashboard;
