'use client';

import React from 'react';
import { Calendar, Plus, Clock, Play, Check } from 'lucide-react';

export default function SchedulesPage() {
  const schedules = [
    {
      id: 'sch_1',
      name: 'Nightly Docs Synchronization',
      cron: '0 2 * * *',
      timezone: 'UTC',
      target: 'Daily Documentation Indexer (Task)',
      status: 'Active',
      lastRun: '10 hours ago',
      nextRun: 'In 14 hours',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">Schedules</h1>
          <p className="text-xs text-slate-400">
            Automate recurring Actor executions using cron expressions with IANA timezone support.
          </p>
        </div>
        <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold text-xs shadow-glow-sm">
          <Plus className="w-4 h-4" />
          Create Schedule
        </button>
      </div>

      <div className="rounded-2xl bg-[#0D131F] border border-[#1A2538] overflow-hidden glass-panel">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#080D15] text-slate-400 uppercase font-mono text-[11px] border-b border-[#172030]">
            <tr>
              <th className="px-4 py-3">Schedule Name</th>
              <th className="px-4 py-3">Cron</th>
              <th className="px-4 py-3">Timezone</th>
              <th className="px-4 py-3">Target Actor / Task</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Next Execution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#172030] text-slate-300">
            {schedules.map((s) => (
              <tr key={s.id} className="hover:bg-[#111827]/60">
                <td className="px-4 py-3 font-semibold text-white">{s.name}</td>
                <td className="px-4 py-3 font-mono text-cyan-400">{s.cron}</td>
                <td className="px-4 py-3 font-mono text-slate-400">{s.timezone}</td>
                <td className="px-4 py-3 text-slate-300">{s.target}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-slate-400">{s.nextRun}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
