import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './components/common/Toast';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ManagerDashboard from './pages/dashboard/ManagerDashboard';
import UserDashboard from './pages/dashboard/UserDashboard';
import UserManagement from './pages/users/UserManagement';
import UserDetail from './pages/users/UserDetail';
import MyProfile from './pages/profile/MyProfile';
import RolesPermissions from './pages/roles/RolesPermissions';
import ActivityLogs from './pages/activity/ActivityLogs';
import Settings from './pages/settings/Settings';
import HelpCenter from './pages/help/HelpCenter';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsConditions from './pages/legal/TermsConditions';
import Notifications from './pages/notifications/Notifications';
import Unauthorized from './pages/errors/Unauthorized';
import NotFound from './pages/errors/NotFound';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <ToastProvider>
            <Router>
              <AppRoutes />
            </Router>
          </ToastProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          user ? (
            <AppLayout>
              {user.role === 'admin' && <AdminDashboard />}
              {user.role === 'manager' && <ManagerDashboard />}
              {user.role === 'user' && <UserDashboard />}
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/users"
        element={
          user && (user.role === 'admin' || user.role === 'manager') ? (
            <AppLayout>
              <UserManagement />
            </AppLayout>
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
      <Route
        path="/users/:id"
        element={
          user && (user.role === 'admin' || user.role === 'manager') ? (
            <AppLayout>
              <UserDetail />
            </AppLayout>
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
      <Route
        path="/users/:id/edit"
        element={
          user && (user.role === 'admin' || user.role === 'manager') ? (
            <AppLayout>
              <div>Edit User Page - To be implemented</div>
            </AppLayout>
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
      <Route
        path="/users/new"
        element={
          user && user.role === 'admin' ? (
            <AppLayout>
              <div>Create User Page - To be implemented</div>
            </AppLayout>
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
      <Route
        path="/profile"
        element={
          user ? (
            <AppLayout>
              <MyProfile />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/roles"
        element={
          user ? (
            <AppLayout>
              <RolesPermissions />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/activity"
        element={
          user && (user.role === 'admin' || user.role === 'manager') ? (
            <AppLayout>
              <ActivityLogs />
            </AppLayout>
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
      <Route
        path="/settings"
        element={
          user ? (
            <AppLayout>
              <Settings />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/notifications"
        element={
          user ? (
            <AppLayout>
              <Notifications />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/help"
        element={
          user ? (
            <AppLayout>
              <HelpCenter />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/privacy"
        element={
          user ? (
            <AppLayout>
              <PrivacyPolicy />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/terms"
        element={
          user ? (
            <AppLayout>
              <TermsConditions />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
