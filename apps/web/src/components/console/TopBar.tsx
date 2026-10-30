'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  Building2,
  Box,
  CheckSquare,
  Calendar,
  Database,
  Key,
  LogOut,
  User,
  ExternalLink,
} from 'lucide-react';
import { CommandPalette } from './CommandPalette';

export function TopBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(false);

  const [selectedOrg, setSelectedOrg] = useState({
    name: 'SJify Core Team',
    slug: 'sjify-core',
    tier: 'Scale',
  });

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 bg-[#090D15]/90 backdrop-blur-md border-b border-[#172030]">
        {/* Left: Organization Switcher & Global Search Bar */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          {/* Org Selector */}
          <div className="relative">
            <button
              onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1E2B40] text-sm text-slate-200 hover:text-white hover:border-cyan-500/40 transition-colors"
            >
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold">{selectedOrg.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {selectedOrg.tier}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isOrgMenuOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-[#0D131F] border border-[#1E2B40] rounded-xl shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 font-mono uppercase">
                  Organizations
                </div>
                <button
                  onClick={() => {
                    setSelectedOrg({ name: 'SJify Core Team', slug: 'sjify-core', tier: 'Scale' });
                    setIsOrgMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-[#162135] transition-colors"
                >
                  <span className="font-medium">SJify Core Team</span>
                  <span className="text-xs text-cyan-400 font-mono">Active</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedOrg({ name: 'Personal Workspace', slug: 'personal', tier: 'Free' });
                    setIsOrgMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-[#162135] transition-colors"
                >
                  <span>Personal Workspace</span>
                  <span className="text-xs text-slate-500 font-mono">Free</span>
                </button>
                <div className="my-1 border-t border-[#1E2B40]" />
                <Link
                  href="/settings"
                  onClick={() => setIsOrgMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-cyan-400 hover:underline"
                >
                  + Create or manage organizations
                </Link>
              </div>
            )}
          </div>

          {/* Global Search trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#111827]/80 border border-[#1E2B40] text-slate-400 hover:text-slate-200 hover:border-cyan-500/40 text-sm transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search platform...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Action Tools: Quick Create, Notifications, Profile Menu */}
        <div className="flex items-center gap-3">
          {/* Quick Create Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold text-xs shadow-glow-sm hover:opacity-95 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isCreateOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#0D131F] border border-[#1E2B40] rounded-xl shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 font-mono uppercase">
                  Quick Create
                </div>
                <Link
                  href="/actors/new"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-[#162135] hover:text-cyan-300 transition-colors"
                >
                  <Box className="w-4 h-4 text-cyan-400" />
                  New Actor
                </Link>
                <Link
                  href="/tasks"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-[#162135] hover:text-cyan-300 transition-colors"
                >
                  <CheckSquare className="w-4 h-4 text-teal-400" />
                  New Task
                </Link>
                <Link
                  href="/schedules"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-[#162135] hover:text-cyan-300 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-purple-400" />
                  New Schedule
                </Link>
                <Link
                  href="/storage"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-[#162135] hover:text-cyan-300 transition-colors"
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  New Storage
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-[#162135] hover:text-cyan-300 transition-colors"
                >
                  <Key className="w-4 h-4 text-amber-400" />
                  New API Token
                </Link>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#090D15]" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-transparent hover:border-[#1E2B40] hover:bg-[#111827] transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-400 text-black font-bold text-xs flex items-center justify-center">
                SJ
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0D131F] border border-[#1E2B40] rounded-xl shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-[#1E2B40]">
                  <p className="text-xs font-semibold text-white">SJify Administrator</p>
                  <p className="text-[11px] text-slate-400 font-mono">admin@sjify.io</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-[#162135] hover:text-white"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Account Settings
                  </Link>
                  <a
                    href="http://localhost:4000/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-[#162135] hover:text-white"
                  >
                    <span className="flex items-center gap-2.5">
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      API Reference
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">/docs</span>
                  </a>
                </div>
                <div className="pt-1 border-t border-[#1E2B40]">
                  <button
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Palette Modal */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
