"use client";

import React from "react";
import { Github, Shield } from "lucide-react";

const LoginPage: React.FC = () => {
  const handleGitHubLogin = () => {
    window.location.href = "https://backend.vibesec.app/api/v2/user/login";
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Brand */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-semibold text-black tracking-tight mb-3">
            VibeSec
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered Security Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-black mb-2">
              Sign in to continue
            </h2>
            <p className="text-gray-500">
              Connect with GitHub to access your repositories
            </p>
          </div>

          <button
            onClick={handleGitHubLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                <strong className="text-black">What happens next:</strong>
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Authorize VibeSec to access your repositories</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Start scanning for security vulnerabilities</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Get AI-powered security insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
