'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Box, PlayCircle, CheckSquare, Calendar, Database, ShieldAlert, CreditCard, Sparkles, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { label: 'Website Content Crawler', category: 'Actors', href: '/store/website-content-crawler', icon: Box },
    { label: 'Generic Web Scraper', category: 'Actors', href: '/store/generic-web-scraper', icon: Box },
    { label: 'Google Search Results Scraper', category: 'Actors', href: '/store/google-search-scraper', icon: Box },
    { label: 'Recent Runs', category: 'Console', href: '/runs', icon: PlayCircle },
    { label: 'Saved Tasks', category: 'Console', href: '/tasks', icon: CheckSquare },
    { label: 'Cron Schedules', category: 'Console', href: '/schedules', icon: Calendar },
    { label: 'Datasets & Key-Value Storage', category: 'Platform', href: '/storage', icon: Database },
    { label: 'Proxy Configuration', category: 'Platform', href: '/proxy', icon: ShieldAlert },
    { label: 'Billing & Usage Quotas', category: 'Platform', href: '/billing', icon: CreditCard },
  ];

  const filtered = query
    ? quickActions.filter(
        (a) =>
          a.label.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : quickActions;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0D131F] border border-[#1E2B40] rounded-2xl shadow-2xl overflow-hidden glass-panel">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-[#1E2B40] gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Actors, Runs, Tasks, Docs or type a command..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#162135] text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-800/80 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-slate-200 group-hover:text-white font-medium">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{item.category}</span>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-500 text-sm">
              No matching items found for &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#090E17] border-t border-[#1E2B40] text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">↓</kbd>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SJify Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
}
