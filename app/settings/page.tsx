"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  ArrowLeft,
  Bell,
  Shield,
  User,
  Mail,
  Github,
  Key,
  Trash2,
  Save,
  Check
} from "lucide-react";
import Link from "next/link";
import AppLayout from "../../components/AppLayout";

interface UserSettings {
  email_notifications: {
    scan_completed: boolean;
    vulnerabilities_found: boolean;
    weekly_summary: boolean;
    security_alerts: boolean;
  };
  scan_preferences: {
    auto_scan_on_push: boolean;
    scan_frequency: 'manual' | 'daily' | 'weekly';
    severity_threshold: 'low' | 'medium' | 'high' | 'critical';
  };
  profile: {
    name: string;
    email: string;
    avatar_url: string;
    github_username: string;
  };
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('https://backend.vibesec.app/api/v2/user/settings', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        // Fallback default settings
        setSettings({
          email_notifications: {
            scan_completed: true,
            vulnerabilities_found: true,
            weekly_summary: false,
            security_alerts: true,
          },
          scan_preferences: {
            auto_scan_on_push: false,
            scan_frequency: 'manual',
            severity_threshold: 'medium',
          },
          profile: {
            name: '',
            email: '',
            avatar_url: '',
            github_username: '',
          },
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const response = await fetch('https://backend.vibesec.app/api/v2/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateNotificationSetting = (key: keyof UserSettings['email_notifications'], value: boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      email_notifications: {
        ...settings.email_notifications,
        [key]: value,
      },
    });
  };

  const updateScanPreference = (key: keyof UserSettings['scan_preferences'], value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      scan_preferences: {
        ...settings.scan_preferences,
        [key]: value,
      },
    });
  };

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.')) {
      return;
    }

    if (!confirm('This will permanently delete your account, scan history, and all associated data. Type "DELETE" to confirm.')) {
      return;
    }

    try {
      const response = await fetch('https://backend.vibesec.app/api/v2/user/delete', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Account deleted successfully. You will be redirected to the login page.');
        window.location.href = '/login';
      } else {
        alert('Failed to delete account. Please try again.');
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SettingsIcon className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SettingsIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load settings</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center">
                <SettingsIcon className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Settings</h1>
              </div>
            </div>
            <button
              onClick={saveSettings}
              disabled={saving}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                saved
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-gray-400 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Email Notifications */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <Bell className="w-6 h-6 text-gray-400 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Email Notifications</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Scan Completed</h3>
                    <p className="text-sm text-gray-600">Get notified when security scans finish</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.email_notifications.scan_completed}
                      onChange={(e) => updateNotificationSetting('scan_completed', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Vulnerabilities Found</h3>
                    <p className="text-sm text-gray-600">Get alerted when new vulnerabilities are discovered</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.email_notifications.vulnerabilities_found}
                      onChange={(e) => updateNotificationSetting('vulnerabilities_found', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Weekly Summary</h3>
                    <p className="text-sm text-gray-600">Receive weekly security reports</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.email_notifications.weekly_summary}
                      onChange={(e) => updateNotificationSetting('weekly_summary', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Security Alerts</h3>
                    <p className="text-sm text-gray-600">Critical security notifications and updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.email_notifications.security_alerts}
                      onChange={(e) => updateNotificationSetting('security_alerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Scan Preferences */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-gray-400 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Scan Preferences</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Auto-scan on Push</h3>
                    <p className="text-sm text-gray-600">Automatically scan repositories when code is pushed</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.scan_preferences.auto_scan_on_push}
                      onChange={(e) => updateScanPreference('auto_scan_on_push', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scan Frequency
                  </label>
                  <select
                    value={settings.scan_preferences.scan_frequency}
                    onChange={(e) => updateScanPreference('scan_frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="manual">Manual only</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Severity Threshold
                  </label>
                  <select
                    value={settings.scan_preferences.severity_threshold}
                    onChange={(e) => updateScanPreference('severity_threshold', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low and above</option>
                    <option value="medium">Medium and above</option>
                    <option value="high">High and above</option>
                    <option value="critical">Critical only</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow border-red-200 border">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <Trash2 className="w-6 h-6 text-red-500 mr-3" />
                <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
                <p className="text-sm text-red-700 mb-4">
                  Permanently delete your VibeSec account and all associated data. This action cannot be undone.
                </p>
                <button
                  onClick={deleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
