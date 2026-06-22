import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Filter, Download, Search, Calendar, User, Shield } from 'lucide-react';
import api from '../../utils/api';

const ActivityLogs = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    action: 'all',
    dateRange: '7days',
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data } = await api.get('/users/activity?limit=50');
      setActivities(data.data.activities);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const actionTypes = [
    { value: 'all', label: 'All Actions' },
    { value: 'user_created', label: 'User Created' },
    { value: 'user_updated', label: 'User Updated' },
    { value: 'user_deleted', label: 'User Deleted' },
    { value: 'user_login', label: 'User Login' },
    { value: 'password_changed', label: 'Password Changed' },
    { value: 'status_changed', label: 'Status Changed' },
  ];

  const getActionColor = (action) => {
    const colors = {
      user_created: 'bg-green-100 text-green-700',
      user_updated: 'bg-blue-100 text-blue-700',
      user_deleted: 'bg-red-100 text-red-700',
      user_login: 'bg-purple-100 text-purple-700',
      password_changed: 'bg-yellow-100 text-yellow-700',
      status_changed: 'bg-orange-100 text-orange-700',
    };
    return colors[action] || 'bg-gray-100 text-gray-700';
  };

  const getActionIcon = (action) => {
    if (action.includes('login')) return '🔐';
    if (action.includes('created')) return '✨';
    if (action.includes('updated')) return '✏️';
    if (action.includes('deleted')) return '🗑️';
    if (action.includes('password')) return '🔑';
    return '📝';
  };

  const formatAction = (action) => {
    const actionMap = {
      user_created: 'User Created',
      user_updated: 'User Updated',
      user_deleted: 'User Deleted',
      user_login: 'User Login',
      password_changed: 'Password Changed',
      status_changed: 'Status Changed',
    };
    return actionMap[action] || action;
  };

  const handleExportLogs = () => {
    // Create CSV content
    const csvContent = [
      ['Activity Logs Export', ''],
      ['Generated:', new Date().toLocaleString()],
      ['Total Activities:', filteredActivities.length],
      [''],
      ['Timestamp', 'Action', 'Performed By', 'Target User', 'Details'],
      ...filteredActivities.map(activity => [
        new Date(activity.timestamp).toLocaleString(),
        formatAction(activity.action),
        activity.performedBy?.name || 'System',
        activity.targetUser?.name || 'N/A',
        activity.details || ''
      ])
    ].map(row => row.join(',')).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `activity-logs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      filters.search === '' ||
      activity.targetUser?.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      activity.performedBy?.name.toLowerCase().includes(filters.search.toLowerCase());

    const matchesAction = filters.action === 'all' || activity.action === filters.action;

    return matchesSearch && matchesAction;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor all system activities and user actions</p>
        </div>
        <button 
          onClick={handleExportLogs}
          className="btn-primary flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Action Type */}
          <select
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {actionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          {/* Date Range */}
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="24hours">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </motion.div>

      {/* Activity List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            </div>
            <span className="text-sm text-gray-500">{filteredActivities.length} activities</span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                    {getActionIcon(activity.action)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${getActionColor(
                          activity.action
                        )}`}
                      >
                        {formatAction(activity.action)}
                      </span>
                      <span className="text-xs text-gray-500">{activity.timeAgo}</span>
                    </div>
                    <p className="text-sm text-gray-900 mb-2">{activity.details}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Target: {activity.targetUser?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        <span>By: {activity.performedBy?.name || 'System'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No activities found matching your filters</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ActivityLogs;
