import React from 'react';
import { Sidebar } from '@/components/console/Sidebar';
import { TopBar } from '@/components/console/TopBar';

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#07090E] text-slate-100 overflow-hidden">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Body Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <TopBar />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
