import React, { useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { mockUsers } from '../lib/mockData';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setUser = useAuth((state) => state.setUser);

  useEffect(() => {
    // Simulate getting session from localStorage
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      const user = mockUsers.find(u => u.id === savedUserId);
      if (user) {
        setUser(user);
      }
    } else {
      setUser(null);
    }
  }, [setUser]);

  return <>{children}</>;
};