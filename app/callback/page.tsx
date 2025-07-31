"use client";

import React, { useEffect, useState } from "react";
import { Loader, AlertCircle } from "lucide-react";

const CallbackPage: React.FC = () => {
  const [status, setStatus] = useState<"processing" | "error">("processing");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const error = url.searchParams.get("error");

        console.log("🔍 DEBUG: Callback URL:", window.location.href);
        console.log("🔍 DEBUG: OAuth code:", code);
        console.log("🔍 DEBUG: OAuth state:", state);
        console.log("🔍 DEBUG: OAuth error:", error);

        if (error) {
          setError(`GitHub OAuth error: ${error}`);
          setStatus("error");
          return;
        }

        if (!code) {
          setError("No authorization code received from GitHub");
          setStatus("error");
          return;
        }

        // Forward the GitHub OAuth code to our backend's callback endpoint
        console.log("🚀 DEBUG: Forwarding OAuth code to backend...");
        
        const response = await fetch(`http://localhost:8000/api/v2/user/callback?code=${code}&state=${state}`, {
          method: "GET",
          credentials: "include",
        });

        console.log("📝 DEBUG: Backend callback response:", response);

        if (response.ok) {
          // Backend should handle the OAuth exchange and return tokens
          const data = await response.json();
          console.log("✅ DEBUG: Callback successful:", data);
          
          // Redirect to main page which will handle the code exchange
          window.location.href = "/";
        } else {
          const errorData = await response.text();
          console.error("❌ DEBUG: Callback failed:", errorData);
          setError(`Backend callback failed: ${response.status} - ${errorData}`);
          setStatus("error");
        }
      } catch (err: any) {
        console.error("💥 DEBUG: Callback error:", err);
        setError(`Callback processing error: ${err.message}`);
        setStatus("error");
      }
    };

    handleCallback();
  }, []);

  if (status === "processing") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white text-lg">Processing GitHub OAuth...</p>
          <p className="text-gray-400 text-sm mt-2">
            Exchanging authorization code with backend
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          OAuth Callback Error
        </h1>
        <p className="text-red-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.href = "/login"}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default CallbackPage;
