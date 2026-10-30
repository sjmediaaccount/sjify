'use client';

import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, CheckCircle2 } from 'lucide-react';

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Insights & Analytics</h1>
        <p className="text-xs text-slate-400">
          Track Actor execution counts, error rates, compute usage, and developer earnings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel">
          <p className="text-xs text-slate-400 font-mono">Total Runs (30d)</p>
          <p className="text-2xl font-bold text-white mt-1">18,450</p>
          <span className="text-[11px] text-emerald-400 font-mono">+12.4% vs last month</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel">
          <p className="text-xs text-slate-400 font-mono">Success Rate</p>
          <p className="text-2xl font-bold text-white mt-1">98.2%</p>
          <span className="text-[11px] text-emerald-400 font-mono">+0.5% reliability</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel">
          <p className="text-xs text-slate-400 font-mono">Unique Users</p>
          <p className="text-2xl font-bold text-white mt-1">4,210</p>
          <span className="text-[11px] text-cyan-400 font-mono">Global active users</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel">
          <p className="text-xs text-slate-400 font-mono">Developer Earnings</p>
          <p className="text-2xl font-bold text-white mt-1">$482.50</p>
          <span className="text-[11px] text-emerald-400 font-mono">Paid via Stripe Connect</span>
        </div>
      </div>
    </div>
  );
}
