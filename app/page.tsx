"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";
import axios from "axios";

type AuthState = "loading" | "success" | "error";

const CodeExchange: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [authError, setAuthError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    const controller = new AbortController();

    const authenticateUser = async () => {
      try {
        const url = new URL(window.location.href);
        const codeParam = url.searchParams.get("code");
        
        // DEBUG: Log current URL and all parameters
        console.log("🔍 DEBUG: Current URL:", window.location.href);
        console.log("🔍 DEBUG: All URL params:", Object.fromEntries(url.searchParams));
        console.log("🔍 DEBUG: Code parameter:", codeParam);

        if (!codeParam) {
          if (authState === "success") return;
          console.log("❌ DEBUG: No code parameter found in URL - redirecting to login");
          // Redirect to login page instead of showing error
          window.location.href = "/login";
          return;
        }

        url.searchParams.delete("code");
        window.history.replaceState({}, document.title, url.toString());

        console.log("🔍 DEBUG: Raw code param:", codeParam);
        
        const decodedCode = decodeURIComponent(codeParam);
        console.log("🔍 DEBUG: Decoded code:", decodedCode);
        
        let codeData;
        try {
          codeData = JSON.parse(decodedCode);
          console.log("🔍 DEBUG: Parsed code data:", codeData);
        } catch (parseError) {
          console.log("❌ DEBUG: JSON parse error:", parseError);
          setAuthError("Invalid code format - not valid JSON: " + decodedCode);
          setAuthState("error");
          return;
        }

        if (!codeData.data || !codeData.signature) {
          console.log("❌ DEBUG: Missing data or signature:", { data: codeData.data, signature: codeData.signature });
          setAuthError("Invalid code format - missing data or signature. Got: " + JSON.stringify(codeData));
          setAuthState("error");
          return;
        }

        console.log("🚀 DEBUG: Sending request to backend with code:", codeData);

        const response = await axios.post(
          // "https://backend.vibesec.app/api/v2/admin/getAllUserPayments",
          "http://localhost:8000/api/v2/user/exchangeCode",

          { code: codeData },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
            signal: controller.signal,
            validateStatus: () => true, // Prevent Axios from throwing on 401
          }
        );

        console.log("📝 DEBUG: Backend response status:", response.status);
        console.log("📝 DEBUG: Backend response headers:", response.headers);
        console.log("📝 DEBUG: Backend response data:", response.data);
        
        if (response.data?.token) {
          console.log("🔑 DEBUG: Storing tokens...");
          localStorage.setItem("session-token", response.data.token)
          localStorage.setItem("csrf", response.data.csrf)
          localStorage.setItem("user_id", response.data.user_id)

          // Set cookies (session-token and X-CSTF-Token)
          document.cookie = `session-token=${response.data.token}; path=/; SameSite=Strict; Secure`;
          document.cookie = `X-CSRF-Token=${response.data.csrf}; path=/; SameSite=Strict; Secure`;
          console.log("🍪 DEBUG: Cookies set successfully");
        } else {
          console.log("⚠️ DEBUG: No token in response data");
        }

        if (response.status >= 200 && response.status < 300) {
          console.log("✅ DEBUG: Authentication successful!");
          setAuthState("success");
          setRedirecting(true);

          setTimeout(() => {
            console.log("🔄 DEBUG: Redirecting to dashboard...");
            window.location.href = "/dashboard";
          }, 1000);
        } else {
          console.log("❌ DEBUG: Authentication failed with status:", response.status);
          console.log("❌ DEBUG: Error response:", response.data);
          setAuthError(response.data?.error || `Authentication failed (Status: ${response.status})`);
          setAuthState("error");
        }
      } catch (error: any) {
        if (error?.name === "AbortError") {
          console.log("🚫 DEBUG: Request aborted");
          return;
        }
        console.error("💥 DEBUG: Unexpected error during authentication:", error);
        console.error("💥 DEBUG: Error name:", error?.name);
        console.error("💥 DEBUG: Error message:", error?.message);
        console.error("💥 DEBUG: Error stack:", error?.stack);
        
        if (error?.response) {
          console.error("💥 DEBUG: Error response status:", error.response.status);
          console.error("💥 DEBUG: Error response data:", error.response.data);
        }
        
        setAuthError(`Authentication failed: ${error?.message || 'Unknown error'}. Please try again.`);
        setAuthState("error");
      }
    };

    authenticateUser();

    return () => controller.abort();
  }, [authState]);

  if (authState === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white text-lg">Authenticating...</p>
          <p className="text-gray-400 text-sm mt-2">
            Please wait while we verify your credentials
          </p>
        </div>
      </div>
    );
  }

  if (authState === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Authentication Failed
          </h1>
          <p className="text-red-600 mb-6">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Authentication Successful!
        </h1>
        <p className="text-green-600 mb-4">Session established and cookies set.</p>
        {redirecting && (
          <div className="flex justify-center">
            <div className="animate-pulse text-sm text-gray-500">
              Redirecting to dashboard...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeExchange;
