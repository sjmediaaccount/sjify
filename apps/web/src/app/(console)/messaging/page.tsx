'use client';

import React from 'react';
import { MessageSquare, Inbox, ShieldCheck } from 'lucide-react';

export default function MessagingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Messaging & Discussions</h1>
        <p className="text-xs text-slate-400">
          Direct communication channels between Actor developers and users for custom requests and issue support.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel text-center py-16 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">No New Messages</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          When users submit reviews, feature inquiries, or support requests for your published Actors, they will appear here.
        </p>
      </div>
    </div>
  );
}
