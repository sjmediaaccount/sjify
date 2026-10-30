'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Database,
  Terminal,
  Code2,
  Cpu,
  Layers,
  CheckCircle2,
  Star,
  Users,
  Play,
  Copy,
  Check,
  Bot,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Activity,
  Sliders,
  DollarSign,
  Lock,
} from 'lucide-react';

export default function MarketingHomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCodeTab, setActiveCodeTab] = useState<'mcp' | 'python' | 'node' | 'curl'>('mcp');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = [
    'All',
    'AI & Agents',
    'E-Commerce',
    'Social Media',
    'Lead Generation',
    'Real Estate',
    'Search Engines',
    'Jobs',
  ];

  const featuredActors = [
    {
      id: 'website-content-crawler',
      title: 'Website Content Crawler',
      author: 'sjify',
      category: 'AI & Agents',
      desc: 'Recursively crawls websites, renders client-side JS with headless Chromium, bypasses anti-bot protections, and exports structured markdown for LLMs & RAG.',
      runs: '18.4k',
      users: '4.2k',
      rating: 4.9,
      price: 'Free',
      badge: 'Official',
    },
    {
      id: 'google-maps-extractor',
      title: 'Google Maps Business Extractor',
      author: 'data-crafter',
      category: 'Lead Generation',
      desc: 'Extracts verified business details, addresses, phone numbers, review ratings, opening hours, and direct website links at scale without API quotas.',
      runs: '42.1k',
      users: '9.8k',
      rating: 4.95,
      price: '$5.00 / 1k results',
      badge: 'Top Actor',
    },
    {
      id: 'ecommerce-price-monitor',
      title: 'Amazon & E-Commerce Scraper',
      author: 'market-intel',
      category: 'E-Commerce',
      desc: 'Extracts real-time product catalogs, pricing fluctuations, stock availability, seller details, customer reviews, and bestseller ranks across marketplaces.',
      runs: '26.8k',
      users: '5.1k',
      rating: 4.88,
      price: '$3.50 / 1k results',
      badge: 'Popular',
    },
    {
      id: 'instagram-profile-scraper',
      title: 'Instagram Posts & Reels Scraper',
      author: 'social-bot',
      category: 'Social Media',
      desc: 'Collects public user profiles, post captions, engagement metrics, hashtags, reel video links, and timestamps with intelligent rate-limit evasion.',
      runs: '33.2k',
      users: '7.4k',
      rating: 4.85,
      price: '$4.00 / 1k results',
      badge: 'Trending',
    },
    {
      id: 'real-estate-listings-aggregator',
      title: 'Zillow & Real Estate Monitor',
      author: 'proptech-ai',
      category: 'Real Estate',
      desc: 'Monitors MLS property listings, price changes, bedroom/bathroom stats, square footage, property tax estimates, and high-res photo URLs.',
      runs: '12.9k',
      users: '2.8k',
      rating: 4.82,
      price: '$6.00 / 1k results',
      badge: 'Verified',
    },
    {
      id: 'job-board-scraper',
      title: 'LinkedIn & Indeed Jobs Crawler',
      author: 'talent-radar',
      category: 'Jobs',
      desc: 'Monitors open vacancies, salary ranges, required technical skillsets, and hiring company profiles across LinkedIn, Indeed, and Glassdoor.',
      runs: '15.3k',
      users: '3.6k',
      rating: 4.91,
      price: 'Free',
      badge: 'Official',
    },
  ];

  const filteredActors = featuredActors.filter((actor) => {
    const matchesCategory = activeCategory === 'All' || actor.category === activeCategory;
    const matchesQuery =
      actor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      actor.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      actor.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const copyCode = (snippet: string, key: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeSnippets = {
    mcp: `{
  "mcpServers": {
    "sjify": {
      "command": "npx",
      "args": ["-y", "@sjify/mcp-server", "--token", "YOUR_SJIFY_API_TOKEN"]
    }
  }
}`,
    python: `from sjify import SjifyClient

client = SjifyClient(token="YOUR_SJIFY_API_TOKEN")

# Trigger scraper Actor
run = client.actor("sjify/website-content-crawler").call(
    run_input={"startUrls": [{"url": "https://news.ycombinator.com"}]}
)

# Fetch structured dataset
dataset = client.dataset(run["defaultDatasetId"]).list_items()
print(f"Scraped {len(dataset)} items successfully.")`,
    node: `import { Actor } from '@sjify/actor-sdk';

const run = await Actor.call('sjify/website-content-crawler', {
  startUrls: [{ url: 'https://news.ycombinator.com' }],
  maxPagesPerCrawl: 25,
});

const dataset = await run.getDataset();
const items = await dataset.getData();
console.log('Scraped dataset items:', items);`,
    curl: `curl --request POST \\
  --url http://localhost:4000/v1/acts/sjify/website-content-crawler/runs \\
  --header 'Authorization: Bearer YOUR_SJIFY_API_TOKEN' \\
  --header 'Content-Type: application/json' \\
  --data '{
    "input": {
      "startUrls": [{ "url": "https://news.ycombinator.com" }],
      "maxPagesPerCrawl": 25
    }
  }'`,
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Marketing Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07090E]/85 border-b border-[#1A2538]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 shadow-glow-sm">
                <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
                  <span className="font-display font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-teal-200 text-lg">
                    SJ
                  </span>
                </div>
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                SJify
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
              <Link href="/store" className="hover:text-cyan-400 transition-colors">
                Actors Store
              </Link>
              <Link href="/pricing" className="hover:text-cyan-400 transition-colors">
                Pricing
              </Link>
              <Link href="/compliance" className="hover:text-cyan-400 transition-colors">
                Compliance
              </Link>
              <Link href="/docs" className="hover:text-cyan-400 transition-colors">
                Docs & API
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#0F172A] border border-[#1E293B] hover:border-cyan-500/40 transition-all"
            >
              Console Login
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black shadow-glow-sm transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 border-b border-[#141E30]">
          {/* Subtle Ambient Radial Gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-teal-500/5 to-transparent blur-[120px] pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
              <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Full Apify-Equivalent Web Scraping & AI Automation Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.12]">
              Marketplace of ready-to-run tools for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                AI agents & scrapers
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
              Extract real-time web data, bypass anti-bot protections with rotating residential proxies,
              and connect containerized scrapers directly into Cursor, Claude, or Python apps via MCP.
            </p>

            {/* Hero Live Search Box */}
            <div className="max-w-2xl mx-auto pt-4">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 1,500+ scrapers (e.g. Google Maps, Amazon, Instagram, LinkedIn)..."
                  className="w-full pl-12 pr-32 py-4 rounded-2xl bg-[#0D131F] border border-[#1E2B40] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-2xl transition-all"
                />
                <button
                  onClick={() => {}}
                  className="absolute right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold text-xs shadow-glow-sm hover:opacity-95"
                >
                  Search
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center justify-center gap-2 flex-wrap pt-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      activeCategory === cat
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-sm'
                        : 'bg-[#0E1524] text-slate-400 hover:text-white border border-[#1A2538]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats Strip */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="p-4 rounded-2xl bg-[#0B101C] border border-[#162236]">
                <p className="text-2xl font-black text-white font-mono">1,500+</p>
                <p className="text-xs text-slate-400">Ready-to-run Actors</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#0B101C] border border-[#162236]">
                <p className="text-2xl font-black text-cyan-400 font-mono">99.9%</p>
                <p className="text-xs text-slate-400">Proxy Success Rate</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#0B101C] border border-[#162236]">
                <p className="text-2xl font-black text-teal-400 font-mono">100M+</p>
                <p className="text-xs text-slate-400">Pages Scraped Monthly</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#0B101C] border border-[#162236]">
                <p className="text-2xl font-black text-emerald-400 font-mono">$5.00</p>
                <p className="text-xs text-slate-400">Free Starting Credits</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Actors Store Showcase */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Tools</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mt-1">
                Popular Web Scrapers & Automation Tools
              </h2>
            </div>
            <Link
              href="/store"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              <span>Explore all in Store</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActors.map((actor) => (
              <div
                key={actor.id}
                className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel-hover flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {actor.badge}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-semibold">{actor.price}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-3 group-hover:text-cyan-300 transition-colors">
                    {actor.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {actor.author}/{actor.id}
                  </p>

                  <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                    {actor.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#172030] flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {actor.rating}
                    </span>
                    <span>•</span>
                    <span>{actor.runs} runs</span>
                  </div>

                  <Link
                    href={`/store/${actor.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Try Actor</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive "Run in 3 Lines of Code" Section */}
        <section className="py-20 bg-[#0B101C] border-y border-[#162236]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-mono">
                <Code2 className="w-3.5 h-3.5" />
                <span>Developer First</span>
              </div>

              <h2 className="text-3xl font-display font-bold text-white tracking-tight leading-tight">
                Integrate scrapers into any AI agent, workflow, or stack
              </h2>

              <p className="text-sm text-slate-400 leading-relaxed">
                Every Actor on SJify is accessible as an HTTP REST endpoint, an official Python or TypeScript SDK,
                and a native Model Context Protocol (MCP) tool that Claude and Cursor can run autonomously.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-300">
                    <strong>Model Context Protocol (MCP)</strong>: Zero setup. Stream tools straight into LLMs.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-300">
                    <strong>Automatic Schema Validation</strong>: Type-safe JSON schemas with input validation.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-300">
                    <strong>Instant Multi-Format Export</strong>: Fetch data as JSON, CSV, JSONL, XML, or RSS.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold text-xs shadow-glow-sm"
                >
                  <span>Explore Developer Documentation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Code Block Window */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-[#07090E] border border-[#1A2538] overflow-hidden shadow-2xl">
                {/* Code Tabs Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#0A0E17] border-b border-[#172030]">
                  <div className="flex items-center gap-2">
                    {[
                      { key: 'mcp', label: 'MCP Server (AI)' },
                      { key: 'python', label: 'Python SDK' },
                      { key: 'node', label: 'Node.js / TS' },
                      { key: 'curl', label: 'cURL / REST' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveCodeTab(tab.key as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                          activeCodeTab === tab.key
                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => copyCode(codeSnippets[activeCodeTab], activeCodeTab)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white font-mono"
                  >
                    {copiedCode === activeCodeTab ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedCode === activeCodeTab ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Preformatted Code Content */}
                <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto text-cyan-300 bg-[#070A10]">
                  <pre>{codeSnippets[activeCodeTab]}</pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Pillars Section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">
              Enterprise Web Scraping Architecture
            </h2>
            <p className="text-sm text-slate-400">
              Engineered for unyielding reliability, anti-blocking evasion, and high-concurrency throughput.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Smart Proxy Network</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rotate residential and datacenter IPs across 100+ countries with automatic sticky sessions and session persistence.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Crawlee & Playwright</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full headless browser automation, canvas fingerprint randomization, automated retry queues, and Cheerio fallback.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Dedicated Storage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Datasets, Key-Value stores, and Request Queues with instant exports to JSON, CSV, XML, Excel, and RSS.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Ethical Compliance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Built-in robots.txt compliance controls, per-domain rate limiting, and adherence to GDPR and CCPA data privacy directives.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Tiers Preview */}
        <section className="py-20 bg-[#0B101C] border-t border-[#162236]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Simple, Predictable Pricing</span>
              </div>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                Plans that scale with your data requirements
              </h2>
              <p className="text-sm text-slate-400">
                100% of your subscription converts to monthly prepaid compute usage credits. No surprise bills.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                {
                  name: 'Free',
                  price: '$0',
                  period: 'forever',
                  credits: '$5.00/mo',
                  ram: '8 GB',
                  runs: '8 concurrent',
                  desc: 'Hobbyists & testing',
                },
                {
                  name: 'Starter',
                  price: '$29',
                  period: 'per month',
                  credits: '$29.00/mo',
                  ram: '64 GB',
                  runs: '32 concurrent',
                  desc: 'Solo devs & small workflows',
                },
                {
                  name: 'Scale',
                  price: '$199',
                  period: 'per month',
                  credits: '$199.00/mo',
                  ram: '256 GB',
                  runs: '128 concurrent',
                  desc: 'Agencies & scaling scrapers',
                  highlight: true,
                },
                {
                  name: 'Business',
                  price: '$999',
                  period: 'per month',
                  credits: '$999.00/mo',
                  ram: '512 GB',
                  runs: '256 concurrent',
                  desc: 'High-volume production data',
                },
                {
                  name: 'Enterprise',
                  price: 'Custom',
                  period: 'annually',
                  credits: 'Tailored',
                  ram: 'Unlimited',
                  runs: 'Custom concurrency',
                  desc: 'Dedicated clusters & SLA',
                },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    tier.highlight
                      ? 'bg-gradient-to-b from-[#0F1E33] to-[#0A1220] border-cyan-500/50 shadow-glow-sm'
                      : 'bg-[#0D131F] border-[#1A2538]'
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-white text-base">{tier.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black font-display text-white">{tier.price}</span>
                      <span className="text-[10px] text-slate-400 font-mono">/{tier.period}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{tier.desc}</p>

                    <div className="mt-4 pt-3 border-t border-[#172030] space-y-1.5 text-xs text-slate-300 font-mono">
                      <div>
                        Credits: <span className="text-cyan-400">{tier.credits}</span>
                      </div>
                      <div>
                        RAM: <span className="text-slate-200">{tier.ram}</span>
                      </div>
                      <div>
                        Runs: <span className="text-slate-200">{tier.runs}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className={`w-full mt-6 py-2 rounded-xl text-center text-xs font-semibold transition-all ${
                      tier.highlight
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow-glow-sm'
                        : 'bg-[#131D2E] text-slate-200 hover:text-white border border-[#1E2E48]'
                    }`}
                  >
                    Select Plan
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                <span>View full plan comparison & usage calculator</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#0D1424] to-teal-950/40 border border-cyan-500/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Ready to automate your web data extraction?
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Sign up today and get $5.00 in platform credits with no credit card required. Run pre-made
              Actors or deploy your first Crawlee scraper in minutes.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold text-xs shadow-glow-sm hover:opacity-95 transition-all"
              >
                Start Free with $5 Credits
              </Link>
              <Link
                href="/store"
                className="px-6 py-3 rounded-xl bg-[#090D16] hover:bg-[#121B2C] text-slate-200 text-xs font-semibold border border-[#1C2A42] transition-colors"
              >
                Explore Actors Store
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#162236] bg-[#05070B] py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5">
                <div className="w-full h-full bg-[#090D16] rounded-[6px] flex items-center justify-center">
                  <span className="font-display font-black text-cyan-400 text-xs">SJ</span>
                </div>
              </div>
              <span className="font-display font-bold text-white text-base">SJify</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The premier open web scraping & cloud automation platform for AI agents, developers, and businesses.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              © {new Date().getFullYear()} SJify Platform Inc. All rights reserved.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">Product</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/store" className="hover:text-cyan-400">
                  Actors Store
                </Link>
              </li>
              <li>
                <Link href="/proxy" className="hover:text-cyan-400">
                  Smart Proxy
                </Link>
              </li>
              <li>
                <Link href="/storage" className="hover:text-cyan-400">
                  Datasets & Storage
                </Link>
              </li>
              <li>
                <Link href="/schedules" className="hover:text-cyan-400">
                  Schedules & Cron
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">Developers</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/docs" className="hover:text-cyan-400">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/actors/new" className="hover:text-cyan-400">
                  Create Actor
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-cyan-400">
                  Crawlee Framework
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-cyan-400">
                  MCP Server
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">Company & Legal</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/pricing" className="hover:text-cyan-400">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="hover:text-cyan-400">
                  Compliance & Robots.txt
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="hover:text-cyan-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="hover:text-cyan-400">
                  GDPR & Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
