import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6"
        >
          <ShieldAlert className="w-12 h-12 text-red-600" />
        </motion.div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Unauthorized Access</h2>
        <p className="text-gray-600 mb-8">
          You do not have permission to view this page. Please contact your administrator if you believe this is an error.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 btn-primary"
        >
          <Home className="w-4 h-4" />
          Go to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
