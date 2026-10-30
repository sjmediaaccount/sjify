'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Box,
  Star,
  Users,
  Play,
  Copy,
  Check,
  Code2,
  FileText,
  DollarSign,
  MessageSquare,
  AlertCircle,
  GitBranch,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

export default function ActorDetailPage() {
  const params = useParams();
  const actorId = (params.actorId as string) || 'website-content-crawler';

  const [activeTab, setActiveTab] = useState<'readme' | 'input' | 'pricing' | 'api' | 'reviews' | 'issues'>('readme');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form input state
  const [startUrl, setStartUrl] = useState('https://news.ycombinator.com');
  const [maxPages, setMaxPages] = useState(25);
  const [isRobotsChecked, setIsRobotsChecked] = useState(true);

  const actor = {
    title: 'Website Content Crawler',
    slug: 'website-content-crawler',
    username: 'sjify',
    rating: 4.9,
    ratingCount: 142,
    users: '4,210',
    runs: '18,450',
    pricing: 'Free ($0.00)',
    description:
      'Recursively traverses target websites, renders client-side JavaScript with headless browsers, bypasses basic anti-bot protections, and exports structured markdown optimized for LLM ingestion, AI agents, and RAG vector search.',
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const curlSnippet = `curl --request POST \\
  --url http://localhost:4000/v1/acts/${actor.slug}/runs \\
  --header 'Authorization: Bearer <SJIFY_API_TOKEN>' \\
  --header 'Content-Type: application/json' \\
  --data '{
    "input": {
      "startUrls": [{ "url": "${startUrl}" }],
      "maxPagesPerCrawl": ${maxPages}
    }
  }'`;

  const jsSnippet = `import { Actor } from '@sjify/actor-sdk';

// Trigger execution via JavaScript SDK
const run = await Actor.call('${actor.username}/${actor.slug}', {
  startUrls: [{ url: '${startUrl}' }],
  maxPagesPerCrawl: ${maxPages},
});

console.log('Run finished with status:', run.status);
const dataset = await run.getDataset();
const items = await dataset.getData();
console.log('Extracted items:', items);`;

  const pythonSnippet = `from sjify import SjifyClient

client = SjifyClient(token="<SJIFY_API_TOKEN>")

# Trigger execution via Python SDK
run = client.actor("${actor.username}/${actor.slug}").call(
    run_input={
        "startUrls": [{"url": "${startUrl}"}],
        "maxPagesPerCrawl": ${maxPages},
    }
)

dataset_items = client.dataset(run["defaultDatasetId"]).list_items()
print(f"Collected {len(dataset_items)} items.")`;

  return (
    <div className="space-y-6">
      {/* Top Header Strip */}
      <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600/30 to-teal-400/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Box className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{actor.title}</h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Official
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {actor.username}/{actor.slug}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono mt-2">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                {actor.rating} ({actor.ratingCount} reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {actor.users} users
              </span>
              <span>•</span>
              <span>{actor.runs} runs</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('input')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-bold text-xs shadow-glow-sm transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Try for Free / Start
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#172030] overflow-x-auto pb-1">
        {[
          { key: 'readme', label: 'Readme', icon: FileText },
          { key: 'input', label: 'Input Form', icon: Terminal },
          { key: 'pricing', label: 'Pricing', icon: DollarSign },
          { key: 'api', label: 'API & Code', icon: Code2 },
          { key: 'reviews', label: 'Reviews', icon: Star },
          { key: 'issues', label: 'Issues', icon: AlertCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#111827]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'readme' && (
        <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-white">About {actor.title}</h2>
          <p>{actor.description}</p>

          <h3 className="text-base font-semibold text-white pt-2">Key Features</h3>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-xs">
            <li>Headless browser scraping powered by <strong>Crawlee + Playwright</strong>.</li>
            <li>Automatic compliance with target website <code>robots.txt</code> and configurable per-domain rate limits.</li>
            <li>Advanced anti-blocking evasion: randomized browser canvas fingerprints and rotating datacenter/residential proxies.</li>
            <li>Direct exports to <strong>JSON, JSONL, CSV, XLSX, XML, HTML, and RSS</strong> formats.</li>
            <li>Exposed as an AI agent tool via SJify Streamable-HTTP <strong>MCP Server</strong>.</li>
          </ul>

          <div className="p-4 rounded-xl bg-[#080D15] border border-[#172233] text-xs text-slate-400 mt-4">
            <p className="font-semibold text-slate-200">Legal Compliance Notice</p>
            <p className="mt-1">
              Users are strictly responsible for adhering to target websites&apos; terms of service, robots.txt directives, and relevant data-protection regulations (GDPR/UK GDPR).
            </p>
          </div>
        </div>
      )}

      {activeTab === 'input' && (
        <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-5">
          <div>
            <h2 className="text-base font-bold text-white">Interactive Input Configuration</h2>
            <p className="text-xs text-slate-400">
              Form generated automatically from the Actor&apos;s <code>INPUT_SCHEMA.json</code>.
            </p>
          </div>

          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Start URL
              </label>
              <input
                type="url"
                value={startUrl}
                onChange={(e) => setStartUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080D15] border border-[#1A2538] text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Max Pages to Crawl: <span className="font-mono text-cyan-400">{maxPages}</span>
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={maxPages}
                onChange={(e) => setMaxPages(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="robots"
                checked={isRobotsChecked}
                onChange={(e) => setIsRobotsChecked(e.target.checked)}
                className="rounded accent-cyan-400"
              />
              <label htmlFor="robots" className="text-xs text-slate-300 select-none">
                Respect target domain <code>robots.txt</code> and enforce per-run rate limiting
              </label>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <Link
                href="/runs"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold text-xs shadow-glow-sm hover:opacity-95"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Container Run
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="space-y-4">
          {/* cURL */}
          <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-200 font-mono">cURL Command</span>
              <button
                onClick={() => copyToClipboard(curlSnippet, 'curl')}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
              >
                {copiedCode === 'curl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode === 'curl' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-[#080D15] border border-[#172233] text-xs font-mono text-cyan-300 overflow-x-auto">
              {curlSnippet}
            </pre>
          </div>

          {/* JavaScript */}
          <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-200 font-mono">JavaScript / TypeScript SDK</span>
              <button
                onClick={() => copyToClipboard(jsSnippet, 'js')}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
              >
                {copiedCode === 'js' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode === 'js' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-[#080D15] border border-[#172233] text-xs font-mono text-cyan-300 overflow-x-auto">
              {jsSnippet}
            </pre>
          </div>

          {/* Python */}
          <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-200 font-mono">Python SDK</span>
              <button
                onClick={() => copyToClipboard(pythonSnippet, 'py')}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
              >
                {copiedCode === 'py' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode === 'py' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-[#080D15] border border-[#172233] text-xs font-mono text-cyan-300 overflow-x-auto">
              {pythonSnippet}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-3">
          <h2 className="text-base font-bold text-white">Pricing Model: {actor.pricing}</h2>
          <p className="text-xs text-slate-300">
            This Actor is free to run under the standard SJify compute model. You only pay for the raw container compute consumed (RAM GB-hours) from your included monthly plan credit.
          </p>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-4">
          <h2 className="text-base font-bold text-white">Developer Reviews ({actor.ratingCount})</h2>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#080D15] border border-[#172233] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Marcus Vance</span>
                <span className="text-amber-400">★★★★★</span>
              </div>
              <p className="text-slate-300">
                Crawls documentation sites with ease. Markdown output plugged straight into our LangChain vector index with zero cleaning required.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'issues' && (
        <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-3">
          <h2 className="text-base font-bold text-white">Community Issues</h2>
          <p className="text-xs text-slate-400">No open issues reported for this Actor version.</p>
        </div>
      )}
    </div>
  );
}
