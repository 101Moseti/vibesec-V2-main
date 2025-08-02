"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, 
  Github, 
  Zap, 
  CreditCard, 
  Settings,
  BarChart3,
  LogOut,
  User
} from "lucide-react";

interface BottomDockProps {
  onLogout: () => void;
  user?: {
    name: string;
    email: string;
    avatar_url: string;
    github_username: string;
  } | null;
}

const BottomDock: React.FC<BottomDockProps> = ({ onLogout, user }) => {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Repositories', href: '/repositories', icon: Github },
    { name: 'Security Scans', href: '/scans', icon: Zap },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="relative">
        {/* Enhanced mirror glass background layers */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl rounded-2xl border border-white/40 shadow-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-white/20 to-white/50 rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-2xl"></div>
        
        {/* Content */}
        <div className="relative px-6 py-4 flex items-center space-x-2">
          {/* Navigation items */}
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                  active
                    ? 'bg-blue-600 shadow-sm scale-105'
                    : 'hover:bg-white/20'
                }`}
                title={item.name}
              >
                <Icon 
                  className={`w-6 h-6 transition-colors ${
                    active 
                      ? 'text-white' 
                      : 'text-gray-700 group-hover:text-gray-900'
                  }`} 
                />
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-black text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                    {item.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Divider */}
          <div className="w-px h-8 bg-white/30 mx-4"></div>

          {/* User profile */}
          {user && (
            <div className="group relative p-2 rounded-lg hover:bg-white/20 transition-all duration-200 hover:scale-105">
              <img
                src={user.avatar_url || '/default-avatar.png'}
                alt={user.name || user.github_username}
                className="w-8 h-8 rounded-lg border border-white/30"
              />
              
              {/* User tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-black text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                  {user.name || user.github_username}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                </div>
              </div>
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="group relative p-3 rounded-lg hover:bg-white/20 transition-all duration-200 hover:scale-105"
            title="Logout"
          >
            <LogOut className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors" />
            
            {/* Logout tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-black text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                Logout
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomDock;
