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

interface SidebarProps {
  onLogout: () => void;
  user?: {
    name: string;
    email: string;
    avatar_url: string;
    github_username: string;
  } | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, user }) => {
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
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <div className="relative">
        {/* Glass background with blur effect */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl"></div>
        
        {/* Sidebar content */}
        <div className="relative p-4 w-20 flex flex-col items-center space-y-4">
          {/* Logo */}
          <div className="mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Navigation items */}
          <div className="flex flex-col space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative p-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-white/30 shadow-lg scale-105'
                      : 'hover:bg-white/20 hover:scale-105'
                  }`}
                  title={item.name}
                >
                  <Icon 
                    className={`w-6 h-6 transition-colors ${
                      active 
                        ? 'text-blue-600' 
                        : 'text-gray-700 group-hover:text-blue-600'
                    }`} 
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                      {item.name}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-8 h-px bg-white/30 my-2"></div>

          {/* User profile */}
          {user && (
            <div className="group relative p-2 rounded-xl hover:bg-white/20 transition-all duration-200">
              <img
                src={user.avatar_url || '/default-avatar.png'}
                alt={user.name || user.github_username}
                className="w-8 h-8 rounded-lg"
              />
              
              {/* User tooltip */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                  {user.name || user.github_username}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              </div>
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="group relative p-3 rounded-xl hover:bg-red-500/20 transition-all duration-200 hover:scale-105"
            title="Logout"
          >
            <LogOut className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors" />
            
            {/* Logout tooltip */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                Logout
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
