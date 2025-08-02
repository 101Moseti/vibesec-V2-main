"use client";

import React, { useState } from "react";

const TestPage: React.FC = () => {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint: string, name: string) => {
    setLoading(true);
    try {
      console.log(`Testing ${name}...`);
      const response = await fetch(`https://backend.vibesec.app${endpoint}`, {
        credentials: 'include',
      });
      
      const result = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      };

      if (response.ok) {
        try {
          const data = await response.json();
          result.data = data;
        } catch (e) {
          const text = await response.text();
          result.data = text;
        }
      } else {
        const errorText = await response.text();
        result.error = errorText;
      }

      setResults(prev => ({
        ...prev,
        [name]: result
      }));

      console.log(`${name} result:`, result);
    } catch (error) {
      console.error(`${name} failed:`, error);
      setResults(prev => ({
        ...prev,
        [name]: { error: error.message }
      }));
    }
    setLoading(false);
  };

  const endpoints = [
    { endpoint: '/api/v2/user/me', name: 'User Data' },
    { endpoint: '/api/v2/user/repositories', name: 'Repositories' },
    { endpoint: '/api/v2/user/getUserScan', name: 'Scans' },
    { endpoint: '/api/v2/user/installations', name: 'Installations' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">VibeSec API Test</h1>
        
        <div className="grid gap-4 mb-8">
          {endpoints.map(({ endpoint, name }) => (
            <button
              key={endpoint}
              onClick={() => testEndpoint(endpoint, name)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Test {name}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            endpoints.forEach(({ endpoint, name }) => {
              setTimeout(() => testEndpoint(endpoint, name), Math.random() * 1000);
            });
          }}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 mb-8"
        >
          Test All Endpoints
        </button>

        <div className="space-y-6">
          {Object.entries(results).map(([name, result]: [string, any]) => (
            <div key={name} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{name}</h2>
              <div className="bg-gray-100 p-4 rounded overflow-auto">
                <pre className="text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
