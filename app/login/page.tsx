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

        <button
          onClick={handleGitHubLogin}
          className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
        >
          <Github className="w-5 h-5" />
          Sign in with GitHub
        </button>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>How it works:</strong>
            <br />
            1. Click "Sign in with GitHub"
            <br />
            2. Authorize VibeSec on GitHub
            <br />
            3. You'll be redirected back with authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
