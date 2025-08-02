"use client";

import React, { useState, useEffect } from "react";
import BottomDock from "./BottomDock";

interface UserData {
  name: string;
  email: string;
  avatar_url: string;
  github_username: string;
}

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('session-token');
      const csrf = localStorage.getItem('csrf');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      if (csrf) {
        headers['X-CSRF-Token'] = csrf;
      }
      
      const response = await fetch('https://backend.vibesec.app/api/v2/user/me', {
        credentials: 'include',
        headers,
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('https://backend.vibesec.app/api/v2/user/logout', {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--vibesec-gray-50)' }}>
      {/* Bottom Dock */}
      <BottomDock onLogout={handleLogout} user={user} />
      
      {/* Main content */}
      <div className="relative pb-24">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
