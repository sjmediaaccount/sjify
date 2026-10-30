'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Box, Plus, Play, Code2, Clock, Terminal, Search, ExternalLink } from 'lucide-react';

export default function ActorsPage() {
  const [search, setSearch] = useState('');

  const myActors = [
    {
      id: 'website-content-crawler',
      name: 'Website Content Crawler',
      version: '1.0.0 (latest)',
      buildStatus: 'READY',
      memory: '1024 MB',
      timeout: '3600s',
      runs: 18450,
      lastRun: '10 minutes ago',
    },
    {
      id: 'generic-web-scraper',
      name: 'Generic Web Scraper',
      version: '1.2.0 (latest)',
      buildStatus: 'READY',
      memory: '512 MB',
      timeout: '1800s',
      runs: 12300,
      lastRun: '2 hours ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">Actors</h1>
          <p className="text-xs text-slate-400">
            Develop, configure, and manage your containerized automation tools.
          </p>
        </div>
        <Link
          href="/actors/new"
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold text-xs shadow-glow-sm hover:opacity-95 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Create from Template
        </Link>
      </div>

      {/* Actors Table / Card List */}
      <div className="rounded-2xl bg-[#0D131F] border border-[#1A2538] overflow-hidden glass-panel">
        <div className="p-4 border-b border-[#172030] flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter Actors..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#080D15] border border-[#172233] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">{myActors.length} total Actors</span>
        </div>

        <div className="divide-y divide-[#172030]">
          {myActors.map((actor) => (
            <div
              key={actor.id}
              className="p-5 flex items-center justify-between hover:bg-[#111827]/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/actors/${actor.id}`}
                      className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors"
                    >
                      {actor.name}
                    </Link>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {actor.buildStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                    <span>Version: {actor.version}</span>
                    <span>•</span>
                    <span>RAM: {actor.memory}</span>
                    <span>•</span>
                    <span>Timeout: {actor.timeout}</span>
                    <span>•</span>
                    <span>Last Run: {actor.lastRun}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/actors/${actor.id}/source`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#1A2538] text-slate-300 hover:text-white border border-[#1E2B40] text-xs transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  Code Studio
                </Link>
                <Link
                  href={`/actors/${actor.id}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors shadow-glow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Start Run
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
