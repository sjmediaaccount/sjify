'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Clock,
  Play,
  Check,
  Pause,
  Trash2,
  Globe,
  Box,
  CheckSquare,
  Sliders,
} from 'lucide-react';

export default function SchedulesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleName, setScheduleName] = useState('Nightly Product Price Check');
  const [cronExpression, setCronExpression] = useState('0 2 * * *');
  const [timezone, setTimezone] = useState('UTC');
  const [targetType, setTargetType] = useState<'ACTOR' | 'TASK'>('ACTOR');
  const [targetActor, setTargetActor] = useState('website-content-crawler');

  const [schedules, setSchedules] = useState([
    {
      id: 'sch_1',
      name: 'Nightly Docs Synchronization',
      cron: '0 2 * * *',
      humanCron: 'Every day at 02:00 UTC',
      timezone: 'UTC',
      target: 'Daily Documentation Indexer (Task)',
      isEnabled: true,
      lastRun: '10 hours ago',
      nextRun: 'In 14 hours',
    },
    {
      id: 'sch_2',
      name: 'Hourly SERP Tracking (Google)',
      cron: '0 * * * *',
      humanCron: 'Every hour on the hour',
      timezone: 'America/New_York',
      target: 'Google Search Results Scraper',
      isEnabled: true,
      lastRun: '22 mins ago',
      nextRun: 'In 38 mins',
    },
  ]);

  const toggleSchedule = (id: string) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
  };

  const handleCreate = () => {
    setSchedules([
      ...schedules,
      {
        id: `sch_${Date.now()}`,
        name: scheduleName,
        cron: cronExpression,
        humanCron: `Cron: ${cronExpression}`,
        timezone,
        target: targetActor,
        isEnabled: true,
        lastRun: 'Never',
        nextRun: 'Scheduled soon',
      },
    ]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">Schedules</h1>
          <p className="text-xs text-slate-400">
            Automate recurring Actor executions using cron expressions with full IANA timezone support.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold text-xs shadow-glow-sm hover:opacity-95"
        >
          <Plus className="w-4 h-4" />
          Create Schedule
        </button>
      </div>

      {/* Schedules Table */}
      <div className="rounded-2xl bg-[#0D131F] border border-[#1A2538] overflow-hidden glass-panel">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#080D15] text-slate-400 uppercase font-mono text-[11px] border-b border-[#172030]">
            <tr>
              <th className="px-4 py-3">Schedule Name</th>
              <th className="px-4 py-3">Frequency / Cron</th>
              <th className="px-4 py-3">Timezone</th>
              <th className="px-4 py-3">Target Actor / Task</th>
              <th className="px-4 py-3">Next Execution</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#172030] text-slate-300">
            {schedules.map((s) => (
              <tr key={s.id} className="hover:bg-[#111827]/60">
                <td className="px-4 py-3 font-semibold text-white">
                  {s.name}
                </td>
                <td className="px-4 py-3 font-mono">
                  <span className="text-cyan-400">{s.cron}</span>
                  <p className="text-[10px] text-slate-500">{s.humanCron}</p>
                </td>
                <td className="px-4 py-3 font-mono text-slate-400 flex items-center gap-1.5 pt-4">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  {s.timezone}
                </td>
                <td className="px-4 py-3 text-slate-200">{s.target}</td>
                <td className="px-4 py-3 font-mono text-slate-400">{s.nextRun}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleSchedule(s.id)}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      s.isEnabled
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {s.isEnabled ? 'ACTIVE' : 'PAUSED'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => alert(`Triggered manual execution for schedule: ${s.name}`)}
                    className="px-2.5 py-1 rounded bg-[#111827] hover:bg-[#1A2538] text-cyan-400 border border-[#1E2B40] text-xs font-mono"
                  >
                    Run Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE SCHEDULE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0D131F] border border-[#1E2B40] rounded-2xl p-6 shadow-2xl glass-panel space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  Schedule Recurring Execution
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">BullMQ cron scheduler with multi-action triggers.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Schedule Name</label>
                <input
                  type="text"
                  value={scheduleName}
                  onChange={(e) => setScheduleName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080D15] border border-[#1A2538] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Frequency Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">Frequency Preset</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Every Hour', cron: '0 * * * *' },
                    { label: 'Daily at 00:00', cron: '0 0 * * *' },
                    { label: 'Weekly (Sunday)', cron: '0 0 * * 0' },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setCronExpression(p.cron)}
                      className={`p-2 rounded-lg border text-xs font-mono text-center transition-colors ${
                        cronExpression === p.cron
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-[#080D15] border-[#172233] text-slate-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Cron Expression</label>
                <input
                  type="text"
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080D15] border border-[#1A2538] text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080D15] border border-[#1A2538] text-xs text-white font-mono"
                >
                  <option value="UTC">UTC (Universal Coordinated Time)</option>
                  <option value="America/New_York">America/New_York (EST/EDT)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Target Actor</label>
                <select
                  value={targetActor}
                  onChange={(e) => setTargetActor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080D15] border border-[#1A2538] text-xs text-white"
                >
                  <option value="website-content-crawler">Website Content Crawler</option>
                  <option value="google-search-scraper">Google Search Results Scraper</option>
                  <option value="generic-web-scraper">Generic Web Scraper</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1E2B40]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#111827] text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black text-xs font-bold shadow-glow-sm"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
