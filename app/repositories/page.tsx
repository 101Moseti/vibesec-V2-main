"use client";

import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Github, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  ExternalLink,
  Lock,
  Unlock
} from "lucide-react";
import Link from "next/link";
import AppLayout from "../../components/AppLayout";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string;
  language: string;
  updated_at: string;
  stargazers_count: number;
  forks_count: number;
}

interface Installation {
  id: number;
  account: {
    login: string;
    avatar_url: string;
  };
  repositories: Repository[];
}

const RepositoriesPage: React.FC = () => {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanningRepos, setScanningRepos] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchInstallations();
    fetchRepositories();
  }, []);

  const fetchInstallations = async () => {
    try {
      const response = await fetch('https://backend.vibesec.app/api/v2/user/installations', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setInstallations(data);
      }
    } catch (error) {
      console.error('Failed to fetch installations:', error);
    }
  };

  const fetchRepositories = async () => {
    try {
      const response = await fetch('https://backend.vibesec.app/api/v2/user/repositories', {
        credentials: 'include',
      });
      if (response.ok) {
        const repos = await response.json();
        setRepositories(repos);
      }
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  const startScan = async (repoId: number, repoName: string) => {
    setScanningRepos(prev => new Set(prev).add(repoId));
    
    try {
      const response = await fetch('https://backend.vibesec.app/api/v2/user/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          repository_id: repoId,
          repository_name: repoName,
        }),
      });

      if (response.ok) {
        alert(`Security scan started for ${repoName}`);
      } else {
        alert('Failed to start scan. Please try again.');
      }
    } catch (error) {
      console.error('Failed to start scan:', error);
      alert('Failed to start scan. Please try again.');
    } finally {
      setScanningRepos(prev => {
        const newSet = new Set(prev);
        newSet.delete(repoId);
        return newSet;
      });
    }
  };

  const getInstallUrl = async () => {
    try {
      const response = await fetch('https://backend.vibesec.app/api/v2/user/app-install-url', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        window.open(data.install_url, '_blank');
      }
    } catch (error) {
      console.error('Failed to get install URL:', error);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <Github className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600 text-lg">Loading repositories...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-8">
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
                  <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Link>
                  <h2 className="text-4xl font-semibold text-black tracking-tight">Repositories</h2>
                  <p className="text-gray-600 mt-2 text-lg">Manage and scan your GitHub repositories</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Github className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-12">
          {repositories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Github className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-black mb-3">No repositories found</h2>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                Install the VibeSec GitHub App to start scanning your repositories for security vulnerabilities.
              </p>
              <button
                onClick={getInstallUrl}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Install VibeSec App
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-black">Your Repositories</h2>
                  <p className="text-gray-600 text-lg">Manage and scan your GitHub repositories for security vulnerabilities.</p>
              </div>
              <button
                onClick={getInstallUrl}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Add More Repositories
              </button>
            </div>

            <div className="grid gap-6">
              {repositories.map((repo) => (
                <div key={repo.id} className="bg-white rounded-lg shadow border">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Github className="w-5 h-5 text-gray-400 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900">{repo.name}</h3>
                          {repo.private ? (
                            <Lock className="w-4 h-4 text-yellow-500 ml-2" />
                          ) : (
                            <Unlock className="w-4 h-4 text-green-500 ml-2" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{repo.full_name}</p>
                        
                        {repo.description && (
                          <p className="text-gray-700 mb-3">{repo.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {repo.language && (
                            <span className="flex items-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                              {repo.language}
                            </span>
                          )}
                          <span>⭐ {repo.stargazers_count}</span>
                          <span>🍴 {repo.forks_count}</span>
                          <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 ml-6">
                        <button
                          onClick={() => startScan(repo.id, repo.name)}
                          disabled={scanningRepos.has(repo.id)}
                          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                            scanningRepos.has(repo.id)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {scanningRepos.has(repo.id) ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Scanning...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-2" />
                              Start Scan
                            </>
                          )}
                        </button>
                        
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </AppLayout>
  );
};

export default RepositoriesPage;
