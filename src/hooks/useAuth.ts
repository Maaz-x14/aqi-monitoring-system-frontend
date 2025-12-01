import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Ensure this matches the named export

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};