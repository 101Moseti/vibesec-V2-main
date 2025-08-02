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
  Star
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

interface UserData {
  id: string;
  login: string;
  avatar_url: string;
  email: string;
}

const Dashboard: React.FC = () => {
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
        setRepositories(repos.slice(0, 5)); // Show only first 5
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
        setScans(scanArray.slice(0, 5)); // Show only first 5
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
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
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
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600 text-lg">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center mr-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-black tracking-tight">VibeSec</h1>
                    <p className="text-sm text-gray-500">Security Platform</p>
                  </div>
                </div>
                <div className="border-l border-gray-200 pl-6">
                  <h2 className="text-4xl font-semibold text-black tracking-tight">Dashboard</h2>
                  <p className="text-gray-600 mt-2 text-lg">Monitor your repositories and security scans</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Today</p>
                  <p className="text-lg font-medium text-black">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Repositories</p>
                  <p className="text-3xl font-semibold text-black mt-2">{repositories.length}</p>
                  <p className="text-gray-400 text-sm mt-1">+2 this week</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Github className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Scans</p>
                  <p className="text-3xl font-semibold text-black mt-2">{scans.length}</p>
                  <p className="text-gray-400 text-sm mt-1">+{getCompletedScans()} completed</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Vulnerabilities</p>
                  <p className="text-3xl font-semibold text-black mt-2">{getTotalVulnerabilities()}</p>
                  <p className="text-green-600 text-sm mt-1">-12% from last week</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Security Score</p>
                  <p className="text-3xl font-semibold text-black mt-2">94%</p>
                  <p className="text-green-600 text-sm mt-1">+5% improvement</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <Plus className="w-7 h-7 mb-3" />
                  <h3 className="text-lg font-semibold">Add Repository</h3>
                  <p className="text-blue-100 text-sm">Connect a new repository</p>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button className="bg-white border border-gray-200 text-black hover:bg-gray-50 p-6 rounded-lg transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <Zap className="w-7 h-7 mb-3 text-gray-600" />
                  <h3 className="text-lg font-semibold">Run Scan</h3>
                  <p className="text-gray-500 text-sm">Start security analysis</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button className="bg-white border border-gray-200 text-black hover:bg-gray-50 p-6 rounded-lg transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <Settings className="w-7 h-7 mb-3 text-gray-600" />
                  <h3 className="text-lg font-semibold">Configure</h3>
                  <p className="text-gray-500 text-sm">Manage settings</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Repositories */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-black">Recent Repositories</h2>
                <Link href="/repositories" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="p-6">
                {repositories.length > 0 ? (
                  <div className="space-y-3">
                    {repositories.slice(0, 5).map((repo) => (
                      <div key={repo.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <Github className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-black">{repo.name}</p>
                            <p className="text-sm text-gray-500">{repo.language || 'Unknown'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center text-gray-500">
                            <Star className="w-4 h-4 mr-1" />
                            <span className="text-sm">{repo.stargazers_count || 0}</span>
                          </div>
                          <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Github className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-black font-medium">No repositories found</p>
                    <p className="text-gray-500 text-sm mt-1">Connect your first repository to get started</p>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      Add Repository
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Scans */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-black">Recent Security Scans</h2>
                <Link href="/scans" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="p-6">
                {scans.length > 0 ? (
                  <div className="space-y-3">
                    {scans.slice(0, 5).map((scan) => (
                      <div key={scan.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            {getStatusIcon(scan.status)}
                          </div>
                          <div>
                            <p className="font-medium text-black">{scan.repository}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(scan.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-black">
                            {scan.vulnerability_count || 0} issues
                          </p>
                          <p className="text-sm text-gray-500 capitalize">{scan.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-black font-medium">No scans found</p>
                    <p className="text-gray-500 text-sm mt-1">Run your first security scan to get started</p>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      Start Scanning
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;