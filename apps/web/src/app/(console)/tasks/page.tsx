'use client';

import React from 'react';
import Link from 'next/link';
import { CheckSquare, Plus, Play, Clock, Box } from 'lucide-react';

export default function TasksPage() {
  const tasks = [
    {
      id: 'task_doc_indexer',
      name: 'Daily Documentation Indexer',
      actor: 'sjify/website-content-crawler',
      memory: '1024 MB',
      timeout: '1800s',
      lastRun: '10 mins ago',
      lastStatus: 'SUCCEEDED',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">Tasks</h1>
          <p className="text-xs text-slate-400">
            Saved Actor configurations with preset input parameters, ready for manual or scheduled runs.
          </p>
        </div>
        <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold text-xs shadow-glow-sm">
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {task.lastStatus}
                </span>
              </div>
              <h3 className="font-semibold text-white text-base mt-3">{task.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{task.actor}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-3 font-mono">
                <span>RAM: {task.memory}</span>
                <span>•</span>
                <span>Timeout: {task.timeout}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#172030] flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Last run: {task.lastRun}</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors shadow-glow-sm">
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Task Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
