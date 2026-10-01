import { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  
  const token = useSelector((state) => state.auth?.user?.token);
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
