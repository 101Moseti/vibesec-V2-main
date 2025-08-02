"use client";

import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Github, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Settings,
  ArrowRight,
  Activity,
  TrendingUp,
  Eye,
  Plus,
  Calendar,
  Users,
  Star,
  Search,
  Bell,
  ChevronRight,
  BarChart3,
  Lock,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import AppLayout from "../../components/AppLayout";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  updated_at: string;
  stargazers_count: number;
  language: string;
}

interface ScanResult {
  id: string;
  repository: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  vulnerability_count: number;
  created_at: string;
}

const NewDashboard: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepositories();
    fetchScans();
  }, []);

  const fetchRepositories = async () => {
    try {
      console.log('Fetching repositories...');
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
      
      const response = await fetch('https://backend.vibesec.app/api/v2/user/repositories', {
        credentials: 'include',
        headers,
      });
      console.log('Repository API response status:', response.status);
      
      if (response.ok) {
        const repos = await response.json();
        console.log('Repositories fetched:', repos);
        setRepositories(repos.slice(0, 5));
      } else {
        const errorText = await response.text();
        console.error('Repository API error:', response.status, errorText);
      }
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
    }
  };

  const fetchScans = async () => {
    try {
      console.log('Fetching scans...');
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
      
      const response = await fetch('https://backend.vibesec.app/api/v2/user/getUserScan', {
        credentials: 'include',
        headers,
      });
      console.log('Scans API response status:', response.status);
      
      if (response.ok) {
        const scanData = await response.json();
        console.log('Scans fetched:', scanData);
        const scanArray = Array.isArray(scanData) ? scanData : [scanData];
        setScans(scanArray.slice(0, 5));
      } else {
        const errorText = await response.text();
        console.error('Scans API error:', response.status, errorText);
      }
    } catch (error) {
      console.error('Failed to fetch scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTotalVulnerabilities = () => {
    return scans.reduce((total, scan) => total + (scan.vulnerability_count || 0), 0);
  };

  const getCompletedScans = () => {
    return scans.filter(scan => scan.status === 'completed').length;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
            <p className="text-blue-500">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ background: 'var(--vibesec-gray-50)' }}>
        {/* Apple-style Hero Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50"></div>
          <div className="relative px-6 py-16 sm:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4 mr-2" />
                  VibeSec Security Command Center
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  Real-time monitoring and
                  <span className="text-blue-600"> threat intelligence</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Advanced security scanning with intelligent threat detection for your repositories
                </p>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center px-4 py-2 bg-green-50 rounded-full border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-green-700 text-sm font-medium">All systems operational</span>
                  <span className="text-green-600 text-sm ml-2">Last scan: 2 minutes ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 pb-16">
          {/* Apple-style Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 -mt-8">
            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Github className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{repositories.length}</div>
              <div className="text-sm font-medium text-gray-600 mb-2">Active Repositories</div>
              <div className="text-xs text-green-600 font-medium">+2 this week</div>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{scans.length}</div>
              <div className="text-sm font-medium text-gray-600 mb-2">Security Scans</div>
              <div className="text-xs text-blue-600 font-medium">{getCompletedScans()} completed</div>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{getTotalVulnerabilities()}</div>
              <div className="text-sm font-medium text-gray-600 mb-2">Vulnerabilities</div>
              <div className="text-xs text-green-600 font-medium">-12% this week</div>
            </div>

            <div className="apple-card p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">94<span className="text-lg">%</span></div>
              <div className="text-sm font-medium text-gray-600 mb-2">Security Score</div>
              <div className="text-xs text-green-600 font-medium">+5% improvement</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Repositories Section */}
            <div className="lg:col-span-2">
              <div className="apple-card p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Recent Projects</h2>
                    <p className="text-gray-600">Monitor and secure your active repositories</p>
                  </div>
                  <Link href="/repositories" className="apple-button apple-button-secondary">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                {repositories.length > 0 ? (
                  <div className="space-y-4">
                    {repositories.map((repo) => (
                      <div key={repo.id} className="group p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                              <Github className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {repo.name}
                              </h3>
                              <p className="text-gray-600 text-sm">{repo.full_name}</p>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <span className="mr-3">{repo.language || 'Unknown'}</span>
                                <Star className="w-3 h-3 mr-1" />
                                <span>{repo.stargazers_count}</span>
                              </div>
                            </div>
                          </div>
                          <button className="apple-button apple-button-primary">
                            <Lock className="w-4 h-4 mr-2" />
                            Scan Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Github className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No repositories yet</h3>
                    <p className="text-gray-600 mb-6">Connect your first repository to start monitoring</p>
                    <Link href="/repositories" className="apple-button apple-button-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Repository
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Recent Scans */}
              <div className="apple-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Recent Scans</h3>
                  <Link href="/scans" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
                
                {scans.length > 0 ? (
                  <div className="space-y-3">
                    {scans.slice(0, 4).map((scan) => (
                      <div key={scan.id} className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{scan.repository}</h4>
                          {getStatusIcon(scan.status)}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            {new Date(scan.created_at).toLocaleDateString()}
                          </span>
                          <span className="font-medium text-gray-900">
                            {scan.vulnerability_count || 0} issues
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">No scans yet</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="apple-card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/repositories" className="flex items-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600">Add Repository</div>
                      <div className="text-xs text-gray-600">Connect a new repo</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </Link>
                  
                  <Link href="/scans" className="flex items-center p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors group">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-green-600">Run Scan</div>
                      <div className="text-xs text-gray-600">Start security analysis</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </Link>
                  
                  <Link href="/settings" className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-gray-600">Settings</div>
                      <div className="text-xs text-gray-600">Configure preferences</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewDashboard;
