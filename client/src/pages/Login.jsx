import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, Users, Shield, BarChart3, FileText, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const demoAccounts = [
    {
      role: 'Super Admin',
      email: 'superadmin@example.com',
      password: 'admin123',
      description: 'Full system access',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-white',
      borderColor: 'border-red-300'
    },
    {
      role: 'Manager',
      email: 'manager@example.com',
      password: 'manager123',
      description: 'Edit non-admin users',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-white',
      borderColor: 'border-purple-300'
    },
    {
      role: 'Manager',
      email: 'geetanshmalik337@gmail.com',
      password: 'manager123',
      description: 'Edit non-admin users',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-white',
      borderColor: 'border-purple-300'
    },
    {
      role: 'User',
      email: 'user1@example.com',
      password: 'user123',
      description: 'View own profile',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-white',
      borderColor: 'border-green-300'
    },
    {
      role: 'User',
      email: 'kartikz@example.com',
      password: 'user123',
      description: 'Standard access',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-white',
      borderColor: 'border-green-300'
    }
  ];

  const handleDemoAccountClick = (email, password) => {
    setFormData({ email, password });
    setShowDemoAccounts(false);
    setErrors({});
    setApiError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      await login(formData.email, formData.password);
      // Navigate immediately after successful login
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setApiError(error.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Role-based access control',
      description: 'Admin, Manager & User tiers'
    },
    {
      icon: BarChart3,
      title: 'Real-time analytics',
      description: 'Live dashboard metrics'
    },
    {
      icon: FileText,
      title: 'Complete audit trail',
      description: 'Track every change'
    }
  ];

  const stats = [
    { value: '500+', label: 'Teams' },
    { value: '99.9%', label: 'Uptime' },
    { value: '256-bit', label: 'Encryption' }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-12 flex-col justify-between text-white relative overflow-hidden"
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-16"
          >
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xl font-semibold">UserManager</span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Manage your<br />team with<br />confidence
            </h1>
            <p className="text-lg text-indigo-100 max-w-md leading-relaxed">
              Enterprise-grade user management with powerful controls, real-time analytics, and bulletproof security.
            </p>
          </motion.div>

          {/* Features */}
          <div className="space-y-3 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <feature.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-0.5">{feature.title}</h3>
                  <p className="text-xs text-indigo-200">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 flex gap-12"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-indigo-200">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">UserManager</span>
          </div>

          {/* Welcome Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </motion.div>

          {/* Session Expired Banner */}
          {new URLSearchParams(window.location.search).get('session') === 'expired' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 mb-6"
            >
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">Session expired. Please login again.</p>
            </motion.div>
          )}

          {/* API Error Alert */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 mb-6"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{apiError}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white transition-all text-sm ${
                    errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  } focus:ring-2 focus:outline-none`}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-600 mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg bg-white transition-all text-sm ${
                    errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  } focus:ring-2 focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-600 mt-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Forgot password?
              </button>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center space-y-3"
          >
            <button
              onClick={() => setShowDemoAccounts(true)}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <Users className="w-4 h-4" />
              View demo accounts
            </button>
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Protected by enterprise-grade security
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Demo Accounts Modal */}
      <AnimatePresence>
        {showDemoAccounts && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowDemoAccounts(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Demo Accounts</h3>
                    <p className="text-sm text-gray-300 mt-0.5">Click any account to auto-fill credentials</p>
                  </div>
                  <button
                    onClick={() => setShowDemoAccounts(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-3 bg-gray-900">
                  {demoAccounts.map((account, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleDemoAccountClick(account.email, account.password)}
                      className={`w-full text-left p-5 border-2 ${account.borderColor} ${account.bgColor} rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all group`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border-2 ${account.borderColor} bg-gradient-to-br from-gray-50 to-gray-100`}>
                          <account.icon className={`w-6 h-6 ${account.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-gray-900 text-lg">{account.role}</h4>
                            <span className="text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">Click to use →</span>
                          </div>
                          <p className="text-sm text-gray-700 font-medium mb-3">{account.description}</p>
                          <div className="flex flex-col gap-1.5 bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-900">
                              <span className="font-bold text-gray-700">Email:</span> <span className="font-mono font-medium">{account.email}</span>
                            </p>
                            <p className="text-sm text-gray-900">
                              <span className="font-bold text-gray-700">Password:</span> <span className="font-mono font-medium">{account.password}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Disclaimer Popup Modal */}
      <AnimatePresence>
        {showDisclaimer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />
                
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Developer Demo Sandbox</h3>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600 mb-6 leading-relaxed">
                  <p>
                    Welcome to the <strong>User Management System (RBAC)</strong> demo! 
                  </p>
                  <p>
                    This application is a <strong>portfolio showcase / coding assignment</strong>. For security, please do not use real emails, personal passwords, or sensitive credentials.
                  </p>
                  <p>
                    A full set of mock testing credentials (for Admin, Manager, and standard User roles) are pre-seeded in the database and can be auto-filled using the <strong>"View demo accounts"</strong> link at the bottom of the login form.
                  </p>
                </div>
                
                <button
                  onClick={() => setShowDisclaimer(false)}
                  className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center"
                >
                  I Understand, Continue
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
