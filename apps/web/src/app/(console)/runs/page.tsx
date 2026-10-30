'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlayCircle, Search, RefreshCw, XCircle, Terminal, Database, Clock, DollarSign } from 'lucide-react';

export default function RunsPage() {
  const [filterStatus, setFilterStatus] = useState('ALL');

  const runs = [
    {
      id: 'run_9f8a2c1b',
      actor: 'sjify/website-content-crawler',
      task: 'Daily Documentation Indexer',
      status: 'SUCCEEDED',
      started: '10 mins ago',
      duration: '42s',
      memory: '1024 MB',
      results: 120,
      cost: '$0.012',
      origin: 'WEB',
    },
    {
      id: 'run_4e7d1a3c',
      actor: 'sjify/generic-web-scraper',
      task: null,
      status: 'RUNNING',
      started: '2 mins ago',
      duration: '1m 58s',
      memory: '2048 MB',
      results: 45,
      cost: '$0.008',
      origin: 'SCHEDULE',
    },
    {
      id: 'run_6b2f8e9d',
      actor: 'sjify/google-search-scraper',
      task: null,
      status: 'SUCCEEDED',
      started: '1 hour ago',
      duration: '18s',
      memory: '512 MB',
      results: 30,
      cost: '$0.060',
      origin: 'API',
    },
    {
      id: 'run_1a9c3d4e',
      actor: 'sjify/ecommerce-product-scraper',
      task: null,
      status: 'FAILED',
      started: '3 hours ago',
      duration: '1m 12s',
      memory: '1024 MB',
      results: 0,
      cost: '$0.005',
      origin: 'WEB',
    },
  ];

  const filtered = filterStatus === 'ALL' ? runs : runs.filter((r) => r.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">Runs</h1>
          <p className="text-xs text-slate-400">
            Monitor real-time container executions, live logs, resource usage, and dataset outputs.
          </p>
        </div>
      </div>

      {/* Runs Table */}
      <div className="rounded-2xl bg-[#0D131F] border border-[#1A2538] overflow-hidden glass-panel">
        <div className="p-4 border-b border-[#172030] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {['ALL', 'RUNNING', 'SUCCEEDED', 'FAILED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  filterStatus === st
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-[#080D15] text-slate-400 hover:text-white border border-[#172233]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-mono">{filtered.length} runs listed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080D15] text-slate-400 uppercase font-mono text-[11px] border-b border-[#172030]">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actor / Task</th>
                <th className="px-4 py-3">Origin</th>
                <th className="px-4 py-3">Started</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Memory</th>
                <th className="px-4 py-3">Results</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172030] text-slate-300">
              {filtered.map((run) => (
                <tr key={run.id} className="hover:bg-[#111827]/60 transition-colors">
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                        run.status === 'SUCCEEDED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : run.status === 'RUNNING'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          run.status === 'SUCCEEDED'
                            ? 'bg-emerald-400'
                            : run.status === 'RUNNING'
                            ? 'bg-cyan-400'
                            : 'bg-rose-400'
                        }`}
                      />
                      {run.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/runs/${run.id}`} className="font-semibold text-white hover:text-cyan-400">
                      {run.actor}
                    </Link>
                    {run.task && (
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">Task: {run.task}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {run.origin}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{run.started}</td>
                  <td className="px-4 py-3 font-mono">{run.duration}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{run.memory}</td>
                  <td className="px-4 py-3 font-mono text-cyan-400">{run.results} items</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{run.cost}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/runs/${run.id}`}
                      className="px-2.5 py-1 rounded bg-[#111827] hover:bg-[#1A2538] text-slate-200 hover:text-white border border-[#1E2B40] text-xs font-mono"
                    >
                      View Logs
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
