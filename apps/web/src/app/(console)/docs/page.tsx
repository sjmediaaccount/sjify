'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Terminal,
  Code2,
  Cpu,
  Layers,
  Database,
  Globe,
  Bot,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<'quickstart' | 'mcp' | 'crawlee' | 'storage' | 'proxy' | 'api'>('quickstart');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copySnippet = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const navItems = [
    { id: 'quickstart', label: 'Quickstart Guide', icon: Terminal },
    { id: 'mcp', label: 'Model Context Protocol (MCP)', icon: Bot },
    { id: 'crawlee', label: 'Crawlee Framework', icon: Cpu },
    { id: 'storage', label: 'Datasets & Key-Value Stores', icon: Database },
    { id: 'proxy', label: 'Smart Proxy Network', icon: Globe },
    { id: 'api', label: 'REST API Reference', icon: Code2 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-6xl pb-12">
      {/* Sidebar Nav */}
      <div className="md:col-span-3 space-y-2">
        <div className="p-3 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase px-3 py-1 block">
            Documentation
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isCurrent = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                  isCurrent
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-[#131D2E]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 rounded-2xl bg-[#0A0E17] border border-[#172233] text-xs text-slate-400 space-y-2">
          <p className="font-semibold text-white">Need Live Help?</p>
          <p className="text-[11px] leading-relaxed">
            Our engineering support team and community Discord are active 24/7.
          </p>
          <Link
            href="/compliance"
            className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            <span>Compliance Guidelines</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Documentation Content */}
      <div className="md:col-span-9 space-y-6">
        {activeSection === 'quickstart' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-6">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Step-by-Step</span>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                SJify Platform Quickstart Guide
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Learn how to develop, test, and run your first automated web scraper in less than 5 minutes.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <h3 className="text-sm font-bold text-white">1. Install the SJify CLI</h3>
              <p className="text-slate-400">
                The official CLI allows you to log in, initialize new Actor repositories, and run them locally using Docker or Node:
              </p>
              <div className="p-3 rounded-xl bg-[#080D15] border border-[#172030] flex items-center justify-between font-mono text-cyan-300">
                <span>npm install -g @sjify/cli</span>
                <button
                  onClick={() => copySnippet('npm install -g @sjify/cli', 'cli-inst')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedKey === 'cli-inst' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <h3 className="text-sm font-bold text-white pt-2">2. Initialize an Actor Project</h3>
              <p className="text-slate-400">
                Use <code>sjify create</code> to choose from starter templates powered by Crawlee:
              </p>
              <div className="p-3 rounded-xl bg-[#080D15] border border-[#172030] font-mono text-cyan-300">
                <span>sjify create my-first-scraper</span>
              </div>

              <h3 className="text-sm font-bold text-white pt-2">3. Run and Push to SJify Cloud</h3>
              <p className="text-slate-400">
                Test your code locally, then deploy with a single command:
              </p>
              <div className="p-3 rounded-xl bg-[#080D15] border border-[#172030] font-mono text-cyan-300">
                <span>sjify run</span>
                <br />
                <span>sjify push</span>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'mcp' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-6">
            <div>
              <span className="text-xs font-mono text-purple-400 uppercase font-semibold">AI Integration</span>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                Model Context Protocol (MCP) Server
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Connect your scrapers directly as autonomous tools for Claude Desktop, Cursor IDE, and custom LLM agents.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>
                SJify provides an official streamable MCP server. LLMs can discover Actors, check input schemas, and trigger scraping jobs to ingest fresh live web data into their context window.
              </p>

              <h3 className="text-sm font-bold text-white">Claude Desktop Configuration</h3>
              <p className="text-slate-400">
                Add the following snippet to your <code>claude_desktop_config.json</code>:
              </p>
              <div className="p-4 rounded-xl bg-[#080D15] border border-[#172030] font-mono text-cyan-300 overflow-x-auto relative">
                <button
                  onClick={() =>
                    copySnippet(
                      JSON.stringify(
                        {
                          mcpServers: {
                            sjify: {
                              command: 'npx',
                              args: ['-y', '@sjify/mcp-server', '--token', 'YOUR_SJIFY_TOKEN'],
                            },
                          },
                        },
                        null,
                        2
                      ),
                      'mcp-cfg'
                    )
                  }
                  className="absolute top-3 right-3 text-slate-400 hover:text-white"
                >
                  {copiedKey === 'mcp-cfg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <pre>{`{
  "mcpServers": {
    "sjify": {
      "command": "npx",
      "args": ["-y", "@sjify/mcp-server", "--token", "YOUR_SJIFY_TOKEN"]
    }
  }
}`}</pre>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'crawlee' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-6">
            <div>
              <span className="text-xs font-mono text-teal-400 uppercase font-semibold">Crawling Library</span>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                Crawlee Open-Source Integration
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                SJify Actors natively run on Crawlee — the leading web scraping library for Node.js and Python.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>
                Crawlee automatically manages URL queues, retries failed HTTP requests, handles rate-limits, and switches between Playwright headless browsers and Cheerio based on page complexity.
              </p>

              <h3 className="text-sm font-bold text-white">Sample Crawlee Playwright Code (`src/main.js`)</h3>
              <div className="p-4 rounded-xl bg-[#080D15] border border-[#172030] font-mono text-cyan-300 overflow-x-auto">
                <pre>{`import { PlaywrightCrawler, Dataset } from 'crawlee';

const crawler = new PlaywrightCrawler({
    async requestHandler({ page, request, log }) {
        log.info(\`Processing \${request.url}\`);
        const title = await page.title();
        await Dataset.pushData({ url: request.url, title, scrapedAt: new Date().toISOString() });
    },
});

await crawler.run(['https://news.ycombinator.com']);`}</pre>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'storage' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-6">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">Persistence</span>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                Datasets, Key-Value Stores & Request Queues
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Built-in cloud storage engines for tabular items, binary assets, and crawl states.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[#080D15] border border-[#172030]">
                  <p className="font-bold text-white">Datasets</p>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Append-only document storage for tabular scraped records. Auto-converts to JSON, CSV, XLSX, XML.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#080D15] border border-[#172030]">
                  <p className="font-bold text-white">Key-Value Stores</p>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Store screenshots, PDFs, JSON configuration state, and serialized files by key.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#080D15] border border-[#172030]">
                  <p className="font-bold text-white">Request Queues</p>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Stateful FIFO/LIFO queue of URLs to crawl with deduplication and failure tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'proxy' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-6">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Anti-Detect</span>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                Smart Proxy Network Integration
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Route scraper traffic through global residential and datacenter proxy pools.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>
                Connect any HTTP client (Python requests, Playwright, cURL) using standard proxy authentication URL syntax:
              </p>

              <div className="p-4 rounded-xl bg-[#080D15] border border-[#172030] font-mono text-cyan-300 overflow-x-auto">
                <pre>{`http://groups-RESIDENTIAL,country-US:YOUR_PROXY_PASSWORD@proxy.sjify.com:8000`}</pre>
              </div>

              <p className="text-slate-400">
                To enable sticky sessions (keeping the same residential IP for up to 30 minutes), append <code>session-YOUR_ID</code> to the username.
              </p>
            </div>
          </div>
        )}

        {activeSection === 'api' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-6">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase font-semibold">Endpoints</span>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                REST API v1 Reference
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Full programmatic control over Actors, Runs, Tasks, Datasets, and Webhooks.
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-[#080D15] border border-[#172030] flex items-center justify-between font-mono">
                <div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold mr-2">GET</span>
                  <span className="text-white">/v1/acts</span>
                </div>
                <span className="text-slate-500">List all Actors</span>
              </div>

              <div className="p-3 rounded-xl bg-[#080D15] border border-[#172030] flex items-center justify-between font-mono">
                <div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold mr-2">POST</span>
                  <span className="text-white">/v1/acts/:actorId/runs</span>
                </div>
                <span className="text-slate-500">Trigger container run</span>
              </div>

              <div className="p-3 rounded-xl bg-[#080D15] border border-[#172030] flex items-center justify-between font-mono">
                <div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold mr-2">GET</span>
                  <span className="text-white">/v1/actor-runs/:runId</span>
                </div>
                <span className="text-slate-500">Get run status & metrics</span>
              </div>

              <div className="p-3 rounded-xl bg-[#080D15] border border-[#172030] flex items-center justify-between font-mono">
                <div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold mr-2">GET</span>
                  <span className="text-white">/v1/datasets/:datasetId/items</span>
                </div>
                <span className="text-slate-500">Export dataset records</span>
              </div>

              <div className="p-3 rounded-xl bg-[#080D15] border border-[#172030] flex items-center justify-between font-mono">
                <div>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold mr-2">POST</span>
                  <span className="text-white">/mcp</span>
                </div>
                <span className="text-slate-500">Streamable MCP JSON-RPC</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
