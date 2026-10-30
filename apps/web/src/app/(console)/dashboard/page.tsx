'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Play,
  Copy,
  Check,
  TrendingUp,
  Cpu,
  Clock,
  Layers,
  Terminal,
  Server,
  Plus,
  Box,
  Key,
} from 'lucide-react';

export default function DashboardPage() {
  const [copiedMcp, setCopiedMcp] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Example spending limit toggle for demonstration
  const [isLimitReached, setIsLimitReached] = useState(false);

  const mcpConfigSnippet = JSON.stringify(
    {
      mcpServers: {
        sjify: {
          type: 'http',
          url: 'http://localhost:4000/mcp',
        },
      },
    },
    null,
    2
  );

  const handleCopyMcp = () => {
    navigator.clipboard.writeText(mcpConfigSnippet);
    setCopiedMcp(true);
    setTimeout(() => setCopiedMcp(false), 2000);
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    if (aiPrompt.toLowerCase().includes('crawl') || aiPrompt.toLowerCase().includes('scrape')) {
      setAiResponse(
        `💡 Recommended Actor: **sjify/website-content-crawler**. It recursively extracts clean markdown and HTML from target domains and supports dynamic JS rendering with Crawlee + Playwright.`
      );
    } else if (aiPrompt.toLowerCase().includes('task') || aiPrompt.toLowerCase().includes('run')) {
      setAiResponse(
        `⚡ Task identified: Ready to trigger **Daily Documentation Indexer**. Allocated RAM: 1024 MB. Click Runs to observe execution.`
      );
    } else {
      setAiResponse(
        `🤖 SJify AI Assistant: I analyzed your request. You can use our MCP tools or trigger an Actor run via the REST API or Webhooks.`
      );
    }
  };

  const suggestedActors = [
    {
      name: 'Website Content Crawler',
      slug: 'website-content-crawler',
      badge: 'Popular for AI',
      desc: 'Crawl websites and convert into clean LLM-ready markdown files.',
      runs: '18.4k runs',
      rating: '4.9 ★',
      memory: '1024 MB',
    },
    {
      name: 'Google Search Results Scraper',
      slug: 'google-search-scraper',
      badge: 'Pay-per-result',
      desc: 'Real-time SERP rankings, organic results, ads, and rich snippets.',
      runs: '45.9k runs',
      rating: '5.0 ★',
      memory: '512 MB',
    },
    {
      name: 'Generic Web Scraper',
      slug: 'generic-web-scraper',
      badge: 'Fast Cheerio',
      desc: 'High-throughput HTML scraper with customizable CSS selectors.',
      runs: '12.3k runs',
      rating: '4.8 ★',
      memory: '512 MB',
    },
  ];

  const recentRuns = [
    {
      id: 'run_9f8a2c1b',
      actor: 'sjify/website-content-crawler',
      status: 'SUCCEEDED',
      started: '10 mins ago',
      duration: '42s',
      memory: '1024 MB',
      results: 120,
      cost: '$0.012',
    },
    {
      id: 'run_4e7d1a3c',
      actor: 'sjify/generic-web-scraper',
      status: 'RUNNING',
      started: '2 mins ago',
      duration: '1m 58s',
      memory: '2048 MB',
      results: 45,
      cost: '$0.008',
    },
    {
      id: 'run_6b2f8e9d',
      actor: 'sjify/google-search-scraper',
      status: 'SUCCEEDED',
      started: '1 hour ago',
      duration: '18s',
      memory: '512 MB',
      results: 30,
      cost: '$0.060',
    },
    {
      id: 'run_1a9c3d4e',
      actor: 'sjify/ecommerce-product-scraper',
      status: 'FAILED',
      started: '3 hours ago',
      duration: '1m 12s',
      memory: '1024 MB',
      results: 0,
      cost: '$0.005',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Monthly Platform Usage Limit Reached Banner (Red/Amber) */}
      {isLimitReached ? (
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-rose-950/80 via-rose-900/60 to-[#170B0E] border border-rose-500/40 text-rose-200 shadow-glow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">
                Monthly Platform Usage Limit Reached ($50.00 / $50.00)
              </p>
              <p className="text-xs text-rose-300/80">
                Actors and scheduled platform features are currently paused. Next billing reset: November 15, 2026.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLimitReached(false)}
              className="text-xs text-rose-300 hover:text-white underline"
            >
              Dismiss Demo
            </button>
            <Link
              href="/billing"
              className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              Upgrade Plan
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#0D1525] border border-[#1A2740] text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">All platform systems operational</span>
            <span className="text-slate-500">•</span>
            <span>Runner Engine: Docker API ready</span>
          </div>
          <button
            onClick={() => setIsLimitReached(true)}
            className="text-slate-500 hover:text-slate-300 font-mono text-[11px]"
            title="Click to preview the limit reached banner state"
          >
            [Simulate Monthly Limit Banner]
          </button>
        </div>
      )}

      {/* 2. Top Header & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            Platform Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Monitor container runs, manage Actor storages, connect AI agents, and inspect usage.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/actors/new"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold text-xs shadow-glow-sm hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Build New Actor
          </Link>
        </div>
      </div>

      {/* 3. Ask SJify AI Natural-Language Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#0B1120] to-[#080D18] border border-cyan-500/20 shadow-glass">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-white">Ask SJify AI Assistant</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
            Natural-Language Command
          </span>
        </div>

        <form onSubmit={handleAiSubmit} className="relative mt-3">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder='e.g. "Find me an Actor that scrapes news with Playwright" or "Run my daily scraper task"'
            className="w-full pl-4 pr-24 py-3 rounded-xl bg-[#090E17] border border-[#1E2B40] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors shadow-glow-sm"
          >
            Ask AI
          </button>
        </form>

        {aiResponse && (
          <div className="mt-3 p-3 rounded-xl bg-[#08101E] border border-cyan-500/30 text-xs text-cyan-100 animate-in fade-in">
            {aiResponse}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 text-xs text-slate-400">
          <span className="text-slate-500">Suggested:</span>
          <button
            type="button"
            onClick={() => setAiPrompt('Find me an Actor that extracts Google search results')}
            className="px-2 py-1 rounded-md bg-[#131C2E] hover:bg-[#1A263E] text-slate-300 transition-colors"
          >
            &quot;Scrape Google SERP&quot;
          </button>
          <button
            type="button"
            onClick={() => setAiPrompt('How do I stream live logs via WebSocket?')}
            className="px-2 py-1 rounded-md bg-[#131C2E] hover:bg-[#1A263E] text-slate-300 transition-colors"
          >
            &quot;Stream live logs&quot;
          </button>
          <button
            type="button"
            onClick={() => setAiPrompt('Explain my last failed run')}
            className="px-2 py-1 rounded-md bg-[#131C2E] hover:bg-[#1A263E] text-slate-300 transition-colors"
          >
            &quot;Explain failed run&quot;
          </button>
        </div>
      </div>

      {/* 4. Grid Section: Spend & Metrics Card + MCP Server Config Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Usage Card (Spend + Sparkline) */}
        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] flex flex-col justify-between glass-panel">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Current Month Spend
              </span>
              <span className="font-mono text-cyan-400">Scale Tier</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-display font-black text-white">$14.85</span>
              <span className="text-xs text-slate-400 font-mono">/ $250.00 limit</span>
            </div>

            {/* Sparkline Progress Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Platform Budget Used</span>
                <span className="font-mono text-slate-300">5.9%</span>
              </div>
              <div className="w-full h-2 bg-[#172030] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full w-[6%]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-[#172030] text-center">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-mono">Active Runs</p>
              <p className="text-sm font-bold text-white mt-0.5">1</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-mono">RAM Usage</p>
              <p className="text-sm font-bold text-white mt-0.5">1.0 GB</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-mono">Storage</p>
              <p className="text-sm font-bold text-white mt-0.5">24.2 MB</p>
            </div>
          </div>
        </div>

        {/* MCP Server Card (One-Click Copy Config for AI Agents) */}
        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] flex flex-col justify-between glass-panel">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-cyan-400" />
                Streamable MCP Server
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Connect Claude, Cursor, Gemini CLI, or custom agents directly to SJify tools.
            </p>

            <div className="relative mt-3 p-3 rounded-xl bg-[#080D15] border border-[#172233] font-mono text-xs text-cyan-300/90 overflow-x-auto">
              <pre className="text-[11px] leading-relaxed">{mcpConfigSnippet}</pre>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#172030]">
            <span className="text-[11px] text-slate-500 font-mono">Protocol: 2024-11-05</span>
            <button
              onClick={handleCopyMcp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
            >
              {copiedMcp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedMcp ? 'Copied!' : 'Copy Config'}
            </button>
          </div>
        </div>

        {/* API Tokens Preview Card */}
        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] flex flex-col justify-between glass-panel">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-400" />
                API Tokens
              </span>
              <Link href="/settings" className="text-xs text-cyan-400 hover:underline">
                Manage all
              </Link>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Authenticate CLI and SDK calls with bearer API tokens.
            </p>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#080D15] border border-[#172233] text-xs">
                <div>
                  <p className="font-medium text-slate-200">Dev CLI & MCP Key</p>
                  <p className="text-[10px] text-slate-500 font-mono">sjify_api_dev_...cdef</p>
                </div>
                <button
                  onClick={() => handleCopyToken('sjify_api_dev_token_secret_1234567890abcdef')}
                  className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
                  title="Copy full token"
                >
                  {copiedToken === 'sjify_api_dev_token_secret_1234567890abcdef' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#080D15] border border-[#172233] text-xs">
                <div>
                  <p className="font-medium text-slate-200">GitHub Actions CI Key</p>
                  <p className="text-[10px] text-slate-500 font-mono">sjify_api_ci_...9a12</p>
                </div>
                <button
                  onClick={() => handleCopyToken('sjify_api_ci_token_secret_abcdef1234567890')}
                  className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
                >
                  {copiedToken === 'sjify_api_ci_token_secret_abcdef1234567890' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Link
            href="/settings"
            className="mt-4 pt-3 border-t border-[#172030] flex items-center justify-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
          >
            + Create New API Token
          </Link>
        </div>
      </div>

      {/* 5. Suggested Actors For You */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-white">Suggested Actors for You</h2>
            <p className="text-xs text-slate-400">Pre-built automation tools ready to run on SJify Cloud.</p>
          </div>
          <Link href="/store" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
            Browse Store <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestedActors.map((actor) => (
            <div
              key={actor.slug}
              className="p-4 rounded-xl bg-[#0D131F] border border-[#1A2538] glass-panel-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Box className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {actor.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-sm mt-3">{actor.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{actor.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#172030] flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">{actor.runs}</span>
                <Link
                  href={`/store/${actor.slug}`}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-black font-semibold text-xs transition-all"
                >
                  <Play className="w-3 h-3 fill-current" />
                  Try Actor
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Recent Actor Runs Table */}
      <div className="rounded-2xl bg-[#0D131F] border border-[#1A2538] overflow-hidden glass-panel">
        <div className="flex items-center justify-between p-4 border-b border-[#172030]">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Runs</h2>
            <p className="text-xs text-slate-400">Live and completed Actor execution history.</p>
          </div>
          <Link href="/runs" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
            View all runs <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080D15] text-slate-400 uppercase font-mono text-[11px] border-b border-[#172030]">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Started</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">RAM</th>
                <th className="px-4 py-3">Results</th>
                <th className="px-4 py-3 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172030] text-slate-300">
              {recentRuns.map((run) => (
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
                  <td className="px-4 py-3 font-medium text-white">
                    <Link href={`/runs/${run.id}`} className="hover:text-cyan-400 transition-colors">
                      {run.actor}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{run.started}</td>
                  <td className="px-4 py-3 font-mono">{run.duration}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{run.memory}</td>
                  <td className="px-4 py-3 font-mono text-cyan-400">{run.results} items</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300">{run.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
