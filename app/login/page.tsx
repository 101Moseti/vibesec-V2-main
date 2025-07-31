"use client";

import React from "react";
import { Github } from "lucide-react";

const LoginPage: React.FC = () => {
  const handleGitHubLogin = () => {
    // Redirect to the backend's GitHub OAuth endpoint
    // The backend will handle the OAuth flow and redirect back with the code
    console.log("🚀 Redirecting to GitHub OAuth...");
    window.location.href = "https://backend.vibesec.app/api/v2/user/login";

  };

  const generateTestCode = async () => {
    // For development: generate a fresh test code
    try {
      console.log("🔄 Generating fresh test code...");
      const response = await fetch("http://localhost:8000/api/v2/user/test-generate-code");
      const data = await response.json();
      
      if (data.code_exchange) {
        console.log("✅ Fresh code generated, redirecting...");
        const encodedCode = encodeURIComponent(data.code_exchange);
        window.location.href = `/?code=${encodedCode}`;
      } else {
        alert("Failed to generate test code");
      }
    } catch (error) {
      console.error("❌ Error generating test code:", error);
      alert(`Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to VibeSec
          </h1>
          <p className="text-gray-600">
            Sign in with your GitHub account to continue
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={generateTestCode}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-3"
          >
            <Github className="w-5 h-5" />
            🔄 Quick Login (Test Code)
          </button>
          
          <button
            onClick={handleGitHubLogin}
            className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-3"
          >
            <Github className="w-5 h-5" />
            GitHub OAuth (Production)
          </button>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800 font-semibold mb-2">
            ⚡ For Development: Quick Login
          </p>
          <p className="text-xs text-green-600 mb-2">
            Uses the backend's test endpoint to generate a fresh authentication code.
          </p>
          <p className="text-sm text-gray-600">
            <strong>How it works:</strong>
            <br />
            1. Click "Quick Login (Test Code)"
            <br />
            2. Backend generates fresh test code
            <br />
            3. Automatically logs you in
            <br />
            4. Redirects to dashboard
          </p>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800 font-semibold mb-1">
            ⚠️ Production OAuth Note
          </p>
          <p className="text-xs text-yellow-600">
            The GitHub OAuth button redirects to production. For real GitHub OAuth in development, the GitHub App needs to be configured with local redirect URIs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
