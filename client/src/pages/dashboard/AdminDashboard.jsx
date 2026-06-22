import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, Plus, ArrowRight, Activity, TrendingUp, Download } from 'lucide-react';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [growthData, setGrowthData] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activityResponse, monthlyStatsResponse] = await Promise.all([
        api.get('/users/stats'),
        api.get('/users/activity?limit=5'),
        api.get('/users/monthly-stats?months=6')
      ]);
      
      setStats(statsResponse.data.data);
      
      // Format activity data
      const activities = activityResponse.data.data.activities.map(activity => ({
        id: activity.id,
        action: formatAction(activity.action),
        user: activity.targetUser?.name || 'Unknown',
        by: activity.performedBy?.name || 'System',
        time: activity.timeAgo
      }));
      
      setRecentActivity(activities);

      // Use real monthly data from backend
      setGrowthData(monthlyStatsResponse.data.data.monthlyStats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAction = (action) => {
    const actionMap = {
      'user_created': 'User created',
      'user_updated': 'User updated',
      'user_deleted': 'User deleted',
      'user_login': 'User logged in',
      'password_changed': 'Password changed',
      'status_changed': 'Status changed'
    };
    return actionMap[action] || action;
  };

  const handleExportReport = () => {
    // Create CSV content
    const csvContent = [
      ['User Management Report', ''],
      ['Generated:', new Date().toLocaleString()],
      [''],
      ['Summary Statistics', ''],
      ['Total Users', stats.total],
      ['Active Users', stats.active],
      ['Inactive Users', stats.inactive],
      [''],
      ['Role Distribution', ''],
      ['Admin', stats.roles?.admin || 0],
      ['Manager', stats.roles?.manager || 0],
      ['User', stats.roles?.user || 0],
      [''],
      ['Monthly Growth', ''],
      ['Month', 'Total', 'Active', 'Inactive'],
      ...growthData.map(d => [d.month, d.total, d.active, d.inactive])
    ].map(row => row.join(',')).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `user-management-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statCards = [
    { title: 'Total Users', value: stats.total, icon: Users, color: 'blue', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { title: 'Active Users', value: stats.active, icon: UserCheck, color: 'green', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
    { title: 'Inactive Users', value: stats.inactive, icon: UserX, color: 'gray', bgColor: 'bg-gray-50', iconColor: 'text-gray-600' },
  ];

  const roleDistribution = [
    { role: 'Admin', count: stats.roles?.admin || 0, color: 'bg-red-500', percentage: ((stats.roles?.admin || 0) / stats.total * 100).toFixed(1) },
    { role: 'Manager', count: stats.roles?.manager || 0, color: 'bg-blue-500', percentage: ((stats.roles?.manager || 0) / stats.total * 100).toFixed(1) },
    { role: 'User', count: stats.roles?.user || 0, color: 'bg-green-500', percentage: ((stats.roles?.user || 0) / stats.total * 100).toFixed(1) },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...growthData.map(d => d.total));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{getGreeting()}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back. Here's what's happening across the workspace today.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">LAST UPDATED: JUST NOW</span>
          <button 
            onClick={handleExportReport}
            className="px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors flex items-center gap-2 border border-indigo-200 dark:border-indigo-800"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 card-hover"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor} dark:bg-opacity-20`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor} dark:opacity-90`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Trajectory Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Growth Trajectory</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">User acquisition over the last 6 months</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">6M</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">1Y</button>
              <button className="px-3 py-1 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">ALL</button>
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-64">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{maxValue}</span>
              <span>{Math.floor(maxValue * 0.75)}</span>
              <span>{Math.floor(maxValue * 0.5)}</span>
              <span>{Math.floor(maxValue * 0.25)}</span>
              <span>0</span>
            </div>

            {/* Chart area */}
            <div className="ml-12 h-full relative border-l border-b border-gray-200 dark:border-gray-700 pl-4 pb-8 flex items-end justify-between gap-2">
              {growthData.map((data, index) => {
                const totalHeight = (data.total / maxValue) * 100;
                const activeHeight = (data.active / maxValue) * 100;
                const inactiveHeight = (data.inactive / maxValue) * 100;
                const isHovered = hoveredPoint === index;
                
                return (
                  <div 
                    key={data.month}
                    className="flex-1 flex flex-col items-center gap-1 relative"
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg z-10 whitespace-nowrap"
                      >
                        <div className="font-semibold mb-1">{data.month}</div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Total: {data.total}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Active: {data.active}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span>Inactive: {data.inactive}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Bars */}
                    <div className="w-full flex gap-0.5 items-end" style={{ height: '200px' }}>
                      {/* Total bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${totalHeight}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className={`flex-1 bg-blue-400 rounded-t transition-all ${isHovered ? 'opacity-100' : 'opacity-80'}`}
                        style={{ minHeight: totalHeight > 0 ? '4px' : '0' }}
                      />
                      {/* Active bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${activeHeight}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.1 }}
                        className={`flex-1 bg-green-400 rounded-t transition-all ${isHovered ? 'opacity-100' : 'opacity-80'}`}
                        style={{ minHeight: activeHeight > 0 ? '4px' : '0' }}
                      />
                      {/* Inactive bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${inactiveHeight}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                        className={`flex-1 bg-gray-400 rounded-t transition-all ${isHovered ? 'opacity-100' : 'opacity-80'}`}
                        style={{ minHeight: inactiveHeight > 0 ? '4px' : '0' }}
                      />
                    </div>
                    
                    {/* Month label */}
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-2">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Total Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Inactive Users</span>
            </div>
          </div>
        </motion.div>

        {/* Role Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Role Distribution</h2>
          
          {/* Donut Chart */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="20"
                />
                
                {/* Role segments */}
                {roleDistribution.map((role, index) => {
                  const prevPercentages = roleDistribution.slice(0, index).reduce((sum, r) => sum + parseFloat(r.percentage), 0);
                  const circumference = 2 * Math.PI * 40;
                  const offset = circumference - (circumference * prevPercentages / 100);
                  const dashArray = `${circumference * parseFloat(role.percentage) / 100} ${circumference}`;
                  
                  const colors = {
                    'bg-red-500': '#ef4444',
                    'bg-blue-500': '#3b82f6',
                    'bg-green-500': '#22c55e',
                  };
                  
                  return (
                    <motion.circle
                      key={role.role}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={colors[role.color]}
                      strokeWidth="20"
                      strokeDasharray={dashArray}
                      strokeDashoffset={offset}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: offset }}
                      transition={{ delay: 0.6 + index * 0.2, duration: 0.8 }}
                      className="transition-all"
                    />
                  );
                })}
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Total Users</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {roleDistribution.map((role) => (
              <div key={role.role} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${role.color} rounded-full`}></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{role.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{role.count}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">({role.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/users" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New User
          </Link>
          <Link to="/users" className="btn-secondary flex items-center gap-2">
            <Users className="w-4 h-4" />
            View All Users
          </Link>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <Link to="/activity" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}: <span className="text-gray-600 dark:text-gray-400">{activity.user}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">by {activity.by}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No recent activity</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
