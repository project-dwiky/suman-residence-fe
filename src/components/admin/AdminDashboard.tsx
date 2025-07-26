"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, Clock, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";

interface CronStatus {
  isActive: boolean;
  lastRun: string | null;
  nextRun: string | null;
  totalSent: number;
  h15Count: number;
  h1Count: number;
}

export function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [cronStatus, setCronStatus] = useState<CronStatus>({
    isActive: true,
    lastRun: null,
    nextRun: null,
    totalSent: 0,
    h15Count: 0,
    h1Count: 0
  });

  // Fetch cron status
  const fetchCronStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cron/status');
      if (response.ok) {
        const data = await response.json();
        setCronStatus(data);
      }
    } catch (error) {
      console.error('Error fetching cron status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger manual reminder check
  const triggerReminders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cron/trigger', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Manual reminder job completed!

📊 Summary:
• H-15 Reminders: ${result.cronResult.summary?.h15Count || 0}
• H-1 Reminders: ${result.cronResult.summary?.h1Count || 0}
• Total Sent: ${result.cronResult.summary?.successful || 0}
• Failed: ${result.cronResult.summary?.failed || 0}

${result.cronResult.details || 'Check console for details'}`);
        
        // Refresh status after manual trigger
        await fetchCronStatus();
      } else {
        alert('❌ Failed to trigger reminder job: ' + result.error);
      }
    } catch (error) {
      alert('❌ Error triggering reminder job: ' + error);
    } finally {
      setLoading(false);
    }
  };

  // Start/Stop cron service
  const toggleCronService = async () => {
    try {
      setLoading(true);
      const action = cronStatus.isActive ? 'stop' : 'start';
      const response = await fetch(`/api/cron/${action}`, { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Cron service ${action}ed successfully!`);
        await fetchCronStatus();
      } else {
        alert(`❌ Failed to ${action} cron service: ` + result.error);
      }
    } catch (error) {
      alert(`❌ Error ${cronStatus.isActive ? 'stopping' : 'starting'} cron service: ` + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCronStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(fetchCronStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Automated Reminder Management System</p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={fetchCronStatus}
                variant="outline"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Status
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Status Card */}
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                {cronStatus.isActive ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                )}
                Cron Service Status
              </h2>
              <p className="text-sm text-gray-600">
                Status: <span className={`font-medium ${cronStatus.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {cronStatus.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
            <Button
              onClick={toggleCronService}
              variant={cronStatus.isActive ? "destructive" : "default"}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {cronStatus.isActive ? 'Stop Service' : 'Start Service'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-600">Last Run</div>
              <div className="text-lg font-bold text-blue-700 mt-1">
                {cronStatus.lastRun ? new Date(cronStatus.lastRun).toLocaleString() : 'Never'}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-green-600">Next Run</div>
              <div className="text-lg font-bold text-green-700 mt-1">
                {cronStatus.nextRun ? new Date(cronStatus.nextRun).toLocaleString() : 'Not scheduled'}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-purple-600">Total Sent Today</div>
              <div className="text-lg font-bold text-purple-700 mt-1">{cronStatus.totalSent}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-orange-600">Service Uptime</div>
              <div className="text-lg font-bold text-orange-700 mt-1">
                {cronStatus.isActive ? '✅ Running' : '❌ Stopped'}
              </div>
            </div>
          </div>
        </Card>

        {/* Reminder Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">H-15 Contract Renewal</h3>
                <p className="text-sm text-gray-600">15 days before contract expiry</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Schedule:</span>
                <span className="text-sm font-medium">Daily at 9:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sent Today:</span>
                <span className="text-sm font-medium text-blue-600">{cronStatus.h15Count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Purpose:</span>
                <span className="text-sm font-medium">Contract renewal confirmation</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-orange-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">H-1 Final Reminder</h3>
                <p className="text-sm text-gray-600">1 day before contract expiry</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Schedule:</span>
                <span className="text-sm font-medium">Daily at 9:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sent Today:</span>
                <span className="text-sm font-medium text-orange-600">{cronStatus.h1Count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Purpose:</span>
                <span className="text-sm font-medium">Final payment reminder</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Manual Actions */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Manual Actions</h3>
              <p className="text-sm text-gray-600">Test and trigger reminder processes manually</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={triggerReminders}
              disabled={loading}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <MessageSquare className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Trigger Reminders</div>
                <div className="text-xs opacity-75">Send all pending reminders now</div>
              </div>
            </Button>

            <Button
              onClick={async () => {
                try {
                  setLoading(true);
                  const response = await fetch('/api/cron/test-h15', { method: 'POST' });
                  const result = await response.json();
                  alert(`H-15 Test Result:\n${JSON.stringify(result, null, 2)}`);
                } catch (error) {
                  alert('Error: ' + error);
                } finally {
                  setLoading(false);
                }
              }}
              variant="outline"
              disabled={loading}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Calendar className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Test H-15</div>
                <div className="text-xs opacity-75">Test 15-day reminders</div>
              </div>
            </Button>

            <Button
              onClick={async () => {
                try {
                  setLoading(true);
                  const response = await fetch('/api/cron/test-h1', { method: 'POST' });
                  const result = await response.json();
                  alert(`H-1 Test Result:\n${JSON.stringify(result, null, 2)}`);
                } catch (error) {
                  alert('Error: ' + error);
                } finally {
                  setLoading(false);
                }
              }}
              variant="outline"
              disabled={loading}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Clock className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Test H-1</div>
                <div className="text-xs opacity-75">Test 1-day reminders</div>
              </div>
            </Button>
          </div>
        </Card>

        {/* System Information */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">How it Works</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Automated cron jobs run daily at 9:00 AM</li>
                <li>• H-15: Sends reminders 15 days before contract expiry</li>
                <li>• H-1: Sends final reminders 1 day before expiry</li>
                <li>• Messages sent via WhatsApp using backend queue</li>
                <li>• System tracks sent reminders to avoid duplicates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Configuration</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Backend: Bun.js with cron-manager</li>
                <li>• Queue: Message queue for WhatsApp delivery</li>
                <li>• Storage: Firebase for booking data</li>
                <li>• Schedule: Configurable cron expressions</li>
                <li>• Monitoring: Real-time status tracking</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
