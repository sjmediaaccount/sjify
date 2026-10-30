'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Store,
  LayoutDashboard,
  Box,
  PlayCircle,
  CheckSquare,
  Network,
  Calendar,
  Code2,
  BarChart3,
  MessageSquare,
  ShieldAlert,
  Database,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
  HelpCircle,
  PanelLeftClose,
  PanelLeft,
  Cpu,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDevOpen, setIsDevOpen] = useState(true);

  // Mocked platform usage values (dynamically updated in real-time)
  const ramUsed = 1024;
  const ramLimit = 8192;
  const ramPercent = Math.round((ramUsed / ramLimit) * 100);

  const spendUsed = 14.85;
  const spendLimit = 50.0;
  const spendPercent = Math.round((spendUsed / spendLimit) * 100);

  const mainNav = [
    { name: 'SJify Store', href: '/store', icon: Store, badge: 'Explore' },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Actors', href: '/actors', icon: Box },
    { name: 'Runs', href: '/runs', icon: PlayCircle },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Integrations', href: '/integrations', icon: Network },
    { name: 'Schedules', href: '/schedules', icon: Calendar },
  ];

  const devNav = [
    { name: 'My Actors', href: '/my-actors', icon: Code2 },
    { name: 'Insights', href: '/insights', icon: BarChart3 },
    { name: 'Messaging', href: '/messaging', icon: MessageSquare },
  ];

  const platformNav = [
    { name: 'Proxy', href: '/proxy', icon: ShieldAlert },
    { name: 'Storage', href: '/storage', icon: Database },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-[#090D15] border-r border-[#172030] transition-all duration-300 z-30 select-none',
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#172030]">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          {/* Custom SJify Logo Symbol */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 shadow-glow-sm text-black font-black text-xl tracking-tighter shrink-0">
            SJ
            <div className="absolute -inset-0.5 rounded-xl bg-cyan-400 opacity-20 blur-sm" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-white tracking-wide flex items-center gap-1.5">
                SJify
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Cloud
                </span>
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Section */}
        <div>
          {!isCollapsed && (
            <div className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase font-mono">
              Main
            </div>
          )}
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-glow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#111827]'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className={cn('w-4 h-4 shrink-0 transition-colors', isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200')} />
                  {!isCollapsed && (
                    <span className="flex-1 truncate">{item.name}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Development Section (Collapsible) */}
        <div>
          {!isCollapsed ? (
            <button
              onClick={() => setIsDevOpen(!isDevOpen)}
              className="w-full flex items-center justify-between px-2 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase font-mono hover:text-slate-300 transition-colors"
            >
              <span>Development</span>
              {isDevOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <div className="my-2 border-t border-[#172030]" />
          )}

          {(isDevOpen || isCollapsed) && (
            <nav className="space-y-1">
              {devNav.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-glow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#111827]'
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className={cn('w-4 h-4 shrink-0 transition-colors', isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200')} />
                    {!isCollapsed && <span className="flex-1 truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Platform Section */}
        <div>
          {!isCollapsed && (
            <div className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase font-mono">
              Platform
            </div>
          )}
          <nav className="space-y-1">
            {platformNav.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-glow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#111827]'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className={cn('w-4 h-4 shrink-0 transition-colors', isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200')} />
                  {!isCollapsed && <span className="flex-1 truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer: RAM Meter, $ Usage Meter, Upgrade Button */}
      {!isCollapsed ? (
        <div className="p-3 border-t border-[#172030] bg-[#07090E]/60 space-y-3">
          {/* RAM Meter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                RAM
              </span>
              <span className="text-slate-300 font-mono text-[11px]">
                {ramUsed} MB / {ramLimit / 1024} GB
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#172030] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-300"
                style={{ width: `${ramPercent}%` }}
              />
            </div>
          </div>

          {/* $ Spend Meter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Usage Spend
              </span>
              <span className="text-slate-300 font-mono text-[11px]">
                ${spendUsed.toFixed(2)} / ${spendLimit.toFixed(2)}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#172030] rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  spendPercent > 80
                    ? 'bg-rose-500'
                    : spendPercent > 50
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                )}
                style={{ width: `${spendPercent}%` }}
              />
            </div>
          </div>

          {/* Upgrade Button */}
          <Link
            href="/billing"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow-glow-sm hover:opacity-95 transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Upgrade Plan
          </Link>

          {/* Help Links */}
          <div className="flex items-center justify-between pt-1 text-slate-500 text-xs">
            <a href="https://docs.sjify.io" target="_blank" rel="noreferrer" className="hover:text-slate-300 flex items-center gap-1 transition-colors">
              <HelpCircle className="w-3.5 h-3.5" />
              Docs & Academy
            </a>
            <span className="font-mono text-[10px] text-slate-600">v1.0.0</span>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-[#172030] flex flex-col items-center gap-2">
          <Link href="/billing" className="p-2 text-cyan-400 hover:bg-slate-800 rounded-lg" title="Upgrade Plan">
            <Sparkles className="w-4 h-4" />
          </Link>
          <a href="https://docs.sjify.io" target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg" title="Documentation">
            <HelpCircle className="w-4 h-4" />
          </a>
        </div>
      )}
    </aside>
  );
}
