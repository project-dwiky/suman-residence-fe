"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Play, AlertCircle, CheckCircle } from "lucide-react";

interface CronStatus {
  success: boolean;
  cronTime?: string;
  mainServiceUrl?: string;
  status?: string;
  timezone?: string;
  nextRun?: string;
  error?: string;
  message?: string;
}

interface TriggerResponse {
  success: boolean;
  message: string;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [cronStatus, setCronStatus] = useState<CronStatus>({
    success: false,
    status: 'disconnected'
  });
  const [lastTrigger, setLastTrigger] = useState<TriggerResponse | null>(null);

  // Fetch cron status
  const fetchCronStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cron/status');
      if (response.ok) {
        const data = await response.json();
        setCronStatus(data);
      } else {
        setCronStatus({
          success: false,
          error: 'Failed to fetch status',
          message: 'Backend connection failed'
        });
      }
    } catch (error) {
      console.error('Error fetching cron status:', error);
      setCronStatus({
        success: false,
        error: 'Connection error',
        message: 'Unable to connect to backend'
      });
    } finally {
      setLoading(false);
    }
  };

  // Trigger manual reminder check
  const triggerReminders = async () => {
    try {
      setTriggering(true);
      const response = await fetch('/api/cron/trigger', { method: 'POST' });
      const result = await response.json();
      
      setLastTrigger(result);
      
      if (result.success) {
        alert('✅ Manual reminder job completed successfully!');
        
        // Refresh status after manual trigger
        await fetchCronStatus();
      } else {
        alert('❌ Failed to trigger reminder job: ' + result.message);
      }
    } catch (error) {
      alert('❌ Error triggering reminder job: ' + error);
    } finally {
      setTriggering(false);
    }
  };

  useEffect(() => {
    fetchCronStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(fetchCronStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cron Management</h1>
          <p className="text-gray-600">Reminder Automation</p>
        </div>
        <Button
          onClick={fetchCronStatus}
          variant="outline"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      <div className="space-y-6">
        {/* Cron Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {cronStatus.success ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              Backend Cron Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg max-w-xs">
              <div className="text-sm font-medium text-blue-600">Schedule</div>
              <div className="text-lg font-bold text-blue-700 mt-1">
                {cronStatus.cronTime || 'Daily 9:00 AM'}
              </div>
            </div>
            
            {cronStatus.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  Error: {cronStatus.message || cronStatus.error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Trigger */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Manual Trigger</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Manually trigger reminder process
                </p>
              </div>
              <Button
                onClick={triggerReminders}
                disabled={triggering}
                className="flex items-center"
              >
                {triggering ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {triggering ? 'Processing...' : 'Trigger Now'}
              </Button>
            </div>
          </CardHeader>
          {lastTrigger && (
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Last Trigger Result</h4>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${lastTrigger.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {lastTrigger.success ? 'Success' : 'Failed'}
                  </div>
                </div>
                {lastTrigger.message && (
                  <p className="text-sm text-gray-600 mt-2">
                    {lastTrigger.message}
                  </p>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}