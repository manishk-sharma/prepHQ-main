// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className='container'>Loading...</div>; 
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}
