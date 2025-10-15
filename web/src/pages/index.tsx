'use client';

import { MoodGraphDashboard } from '@/components/dashboard/MoodGraphDashboard';

/**
 * Main dashboard page for MindWeave OS
 * Displays mood tracking, trends, and insights
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <MoodGraphDashboard />
    </div>
  );
}
