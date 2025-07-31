"use client";

import React from "react";

const TestPage: React.FC = () => {
  const startGitHubOAuth = () => {
    // Redirect to GitHub OAuth via backend
    console.log("🚀 Starting real GitHub OAuth flow...");
    window.location.href = "http://localhost:8000/api/v2/user/login";
  };

  const generateFreshCode = async () => {
    try {
      console.log("🔄 Generating fresh test code from backend...");
      const response = await fetch("http://localhost:8000/api/v2/user/test-generate-code");
      const data = await response.json();
      
      if (data.code_exchange) {
        console.log("✅ Fresh code generated:", data.code_exchange);
        const encodedCode = encodeURIComponent(data.code_exchange);
        window.location.href = `/?code=${encodedCode}`;
      } else {
        alert("Failed to generate fresh code");
      }
    } catch (error) {
      console.error("❌ Error generating fresh code:", error);
      alert(`Error: ${error}`);
    }
  };

  const testWithMockCode = () => {
    // Test with old format mock code
    const testCodeData = {
      data: "test-data-123",
      signature: "test-signature-456"
    };
    
    const encodedCode = encodeURIComponent(JSON.stringify(testCodeData));
    window.location.href = `/?code=${encodedCode}`;
  };

  const testWithInvalidCode = () => {
    // Test with invalid JSON
    const invalidCode = "invalid-json-code";
    window.location.href = `/?code=${invalidCode}`;
  };

  const testWithMissingFields = () => {
    // Test with missing data/signature
    const testCodeData = {
      data: "test-data-123"
      // missing signature
    };
    
    const encodedCode = encodeURIComponent(JSON.stringify(testCodeData));
    window.location.href = `/?code=${encodedCode}`;
  };

  const testBackendConnection = async () => {
    try {
      console.log("🧪 Testing backend connection...");
      const response = await fetch("http://localhost:8000/api/v2/user/health");
      console.log("🧪 Backend health check response:", response);
      const data = await response.text();
      console.log("🧪 Backend health check data:", data);
      alert(`Backend connection test: ${response.ok ? 'SUCCESS' : 'FAILED'}\nStatus: ${response.status}\nData: ${data}`);
    } catch (error) {
      console.error("🧪 Backend connection error:", error);
      alert(`Backend connection test: FAILED\nError: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          🧪 Debug Test Page
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={testBackendConnection}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Test Backend Connection
          </button>
          
          <button
            onClick={startGitHubOAuth}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            🚀 Start Real GitHub OAuth
          </button>
          
          <button
            onClick={generateFreshCode}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🔄 Generate Fresh Test Code
          </button>
          
          <button
            onClick={testWithMockCode}
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Test with Mock Code (Will Fail)
          </button>
          
          <button
            onClick={testWithInvalidCode}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Test with Invalid Code
          </button>
          
          <button
            onClick={testWithMissingFields}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Test with Missing Fields
          </button>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-semibold mb-2">
              ⚡ Quick Test (Recommended)
            </p>
            <p className="text-xs text-blue-600 mb-3">
              Codes expire in 5 minutes! Use "Generate Fresh Test Code" for immediate testing.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Instructions:</strong>
              <br />1. Open browser dev tools (F12) → Console tab
              <br />2. Click "🔄 Generate Fresh Test Code" 
              <br />3. Watch console logs for detailed debugging info
              <br />4. Should redirect to dashboard on success!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
