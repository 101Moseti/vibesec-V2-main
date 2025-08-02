"use client";

import React, { useState, useEffect } from "react";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Search
} from "lucide-react";
import Link from "next/link";
import AppLayout from "../../components/AppLayout";

interface Vulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  file: string;
  line: number;
  rule_id: string;
  cwe?: string;
}

interface ScanResult {
  id: string;
  repository: string;
  repository_id: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  vulnerabilities: Vulnerability[];
  vulnerability_count: number;
  created_at: string;
  completed_at?: string;
  scan_duration?: number;
}

const ScansPage: React.FC = () => {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [filteredScans, setFilteredScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchScans();
  }, []);

  useEffect(() => {
    filterScans();
  }, [scans, statusFilter, searchTerm]);

  const fetchScans = async () => {
    try {
      const response = await fetch('https://backend.vibesec.app/api/v2/user/getUserScan', {
        credentials: 'include',
      });
      if (response.ok) {
        const scanData = await response.json();
        setScans(Array.isArray(scanData) ? scanData : [scanData]);
      }
    } catch (error) {
      console.error('Failed to fetch scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterScans = () => {
    let filtered = scans;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(scan => scan.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(scan => 
        scan.repository.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredScans(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running': return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportScanResults = (scan: ScanResult) => {
    const data = {
      repository: scan.repository,
      scan_date: scan.created_at,
      status: scan.status,
      vulnerability_count: scan.vulnerability_count,
      vulnerabilities: scan.vulnerabilities
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibesec-scan-${scan.repository}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading security scans...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Security Scans</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {scans.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No scans found</h2>
            <p className="text-gray-600 mb-6">
              Start your first security scan from the repositories page.
            </p>
            <Link
              href="/repositories"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Repositories
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search repositories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="running">Running</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <button
                  onClick={fetchScans}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Scans List */}
            <div className="space-y-4">
              {filteredScans.map((scan) => (
                <div key={scan.id} className="bg-white rounded-lg shadow border">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {getStatusIcon(scan.status)}
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">{scan.repository}</h3>
                          <p className="text-sm text-gray-500">
                            Started {new Date(scan.created_at).toLocaleString()}
                            {scan.completed_at && (
                              <span> • Completed {new Date(scan.completed_at).toLocaleString()}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {scan.status === 'completed' && (
                          <>
                            <button
                              onClick={() => setSelectedScan(scan)}
                              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={() => exportScanResults(scan)}
                              className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{scan.vulnerability_count}</p>
                        <p className="text-sm text-gray-600">Total Issues</p>
                      </div>
                      {scan.status === 'completed' && scan.vulnerabilities && (
                        <>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <p className="text-2xl font-bold text-red-600">
                              {scan.vulnerabilities.filter(v => v.severity === 'critical').length}
                            </p>
                            <p className="text-sm text-red-600">Critical</p>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <p className="text-2xl font-bold text-orange-600">
                              {scan.vulnerabilities.filter(v => v.severity === 'high').length}
                            </p>
                            <p className="text-sm text-orange-600">High</p>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-600">
                              {scan.vulnerabilities.filter(v => v.severity === 'medium').length}
                            </p>
                            <p className="text-sm text-yellow-600">Medium</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scan Details Modal */}
        {selectedScan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Scan Results: {selectedScan.repository}
                </h2>
                <button
                  onClick={() => setSelectedScan(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-4">
                  {selectedScan.vulnerabilities?.map((vuln, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{vuln.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(vuln.severity)}`}>
                          {vuln.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{vuln.description}</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p><strong>File:</strong> {vuln.file}:{vuln.line}</p>
                        <p><strong>Rule ID:</strong> {vuln.rule_id}</p>
                        {vuln.cwe && <p><strong>CWE:</strong> {vuln.cwe}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>
    </AppLayout>
  );
};

export default ScansPage;
