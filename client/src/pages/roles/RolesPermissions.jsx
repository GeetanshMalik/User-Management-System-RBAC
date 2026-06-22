import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, X, Info } from 'lucide-react';
import api from '../../utils/api';

const RolesPermissions = () => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, roles: { admin: 0, manager: 0, user: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/users/stats');
      console.log('Full API response:', response.data);
      console.log('Stats data:', response.data.data);
      console.log('Roles breakdown:', response.data.data.roles);
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const roles = useMemo(() => [
    {
      id: 'admin',
      name: 'Administrator',
      color: 'red',
      description: 'Full system access with all permissions',
      users: stats.roles?.admin || 0,
    },
    {
      id: 'manager',
      name: 'Manager',
      color: 'blue',
      description: 'Can manage users and view reports',
      users: stats.roles?.manager || 0,
    },
    {
      id: 'user',
      name: 'User',
      color: 'green',
      description: 'Basic access to personal profile',
      users: stats.roles?.user || 0,
    },
  ], [stats.roles]);

  const permissions = [
    {
      category: 'User Management',
      items: [
        { id: 'user.create', name: 'Create Users', admin: true, manager: false, user: false },
        { id: 'user.read', name: 'View Users', admin: true, manager: true, user: false },
        { id: 'user.update', name: 'Edit Users', admin: true, manager: true, user: false },
        { id: 'user.delete', name: 'Delete Users', admin: true, manager: false, user: false },
        { id: 'user.profile', name: 'Edit Own Profile', admin: true, manager: true, user: true },
      ],
    },
    {
      category: 'Role Management',
      items: [
        { id: 'role.create', name: 'Create Roles', admin: true, manager: false, user: false },
        { id: 'role.read', name: 'View Roles', admin: true, manager: true, user: true },
        { id: 'role.update', name: 'Edit Roles', admin: true, manager: false, user: false },
        { id: 'role.delete', name: 'Delete Roles', admin: true, manager: false, user: false },
      ],
    },
    {
      category: 'Activity Logs',
      items: [
        { id: 'activity.read', name: 'View Activity Logs', admin: true, manager: true, user: false },
        { id: 'activity.export', name: 'Export Activity Logs', admin: true, manager: false, user: false },
      ],
    },
    {
      category: 'System Settings',
      items: [
        { id: 'settings.read', name: 'View Settings', admin: true, manager: true, user: true },
        { id: 'settings.theme', name: 'Change Theme', admin: true, manager: true, user: true },
        { id: 'settings.notifications', name: 'Manage Notifications', admin: true, manager: true, user: true },
        { id: 'settings.update', name: 'Modify System Settings', admin: true, manager: false, user: false },
        { id: 'settings.backup', name: 'Backup System', admin: true, manager: false, user: false },
      ],
    },
    {
      category: 'Account Management',
      items: [
        { id: 'account.disable', name: 'Disable Own Account', admin: true, manager: true, user: true },
        { id: 'account.delete', name: 'Delete Own Account', admin: true, manager: true, user: true },
        { id: 'account.password', name: 'Change Password', admin: true, manager: true, user: true },
      ],
    },
    {
      category: 'Reports & Analytics',
      items: [
        { id: 'reports.view', name: 'View Reports', admin: true, manager: true, user: false },
        { id: 'reports.export', name: 'Export Reports', admin: true, manager: true, user: false },
        { id: 'reports.create', name: 'Create Custom Reports', admin: true, manager: false, user: false },
      ],
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800', hover: 'hover:bg-red-100 dark:hover:bg-red-900/30' },
      blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30' },
      green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800', hover: 'hover:bg-green-100 dark:hover:bg-green-900/30' },
    };
    return colors[color];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Roles & Permissions</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Define and manage role-based access control</p>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3"
      >
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">Role-Based Access Control (RBAC)</p>
          <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
            Permissions are automatically enforced across the system. Changes take effect immediately.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Roles</h2>
          <div className="space-y-3">
            {roles.map((role) => {
              const colors = getColorClasses(role.color);
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? `${colors.bg} ${colors.border}`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className={`w-5 h-5 ${isSelected ? colors.text : 'text-gray-400 dark:text-gray-500'}`} />
                      <span className={`font-semibold ${isSelected ? colors.text : 'text-gray-900 dark:text-white'}`}>
                        {role.name}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {role.users} users
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Permissions Matrix */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Permission Matrix</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-gray-600 dark:text-gray-400">Allowed</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                <span className="text-gray-600 dark:text-gray-400">Denied</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {permissions.map((category, idx) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.items.map((permission) => {
                    const hasPermission = permission[selectedRole];
                    return (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-sm text-gray-900 dark:text-white font-medium">{permission.name}</span>
                        <div className="flex items-center gap-2">
                          {hasPermission ? (
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <Check className="w-4 h-4" />
                              <span className="text-xs font-medium">Allowed</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-400 dark:text-gray-600">
                              <X className="w-4 h-4" />
                              <span className="text-xs font-medium">Denied</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RolesPermissions;
