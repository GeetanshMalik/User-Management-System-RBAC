import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only check token on initial mount
    if (!isInitialized) {
      const token = localStorage.getItem('token');
      if (token) {
        // Verify token and get user
        api.get('/auth/me')
          .then(response => {
            setUser(response.data.data.user); // Backend returns data.data.user
          })
          .catch(() => {
            localStorage.removeItem('token');
          })
          .finally(() => {
            setLoading(false);
            setIsInitialized(true);
          });
      } else {
        setLoading(false);
        setIsInitialized(true);
      }
    }
  }, [isInitialized]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data.data; // Backend returns data.data
    localStorage.setItem('token', token);
    setUser(user);
    setIsInitialized(true);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};