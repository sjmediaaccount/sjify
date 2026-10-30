'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Code2,
  Box,
  FileCode,
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  GitBranch,
  CheckCircle,
  Sparkles,
  Sliders,
  Play,
} from 'lucide-react';

export default function NewActorPage() {
  const router = useRouter();

  const [selectedTemplate, setSelectedTemplate] = useState('crawlee-playwright');
  const [actorName, setActorName] = useState('');
  const [actorTitle, setActorTitle] = useState('');
  const [description, setDescription] = useState('');
  const [defaultMemory, setDefaultMemory] = useState(2048);
  const [isPublic, setIsPublic] = useState(false);
  const [gitUrl, setGitUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const templates = [
    {
      id: 'crawlee-playwright',
      name: 'Crawlee + Playwright (Recommended)',
      lang: 'Node.js / TypeScript',
      desc: 'Full headless browser scraping with automated fingerprint randomization, proxy rotation, and screenshot capabilities.',
      icon: Terminal,
      defaultRam: 2048,
    },
    {
      id: 'crawlee-cheerio',
      name: 'Crawlee + Cheerio',
      lang: 'Node.js / TypeScript',
      desc: 'Ultra-fast HTTP crawling with Cheerio HTML parsing. Minimal memory consumption, ideal for static documentation and public APIs.',
      icon: FileCode,
      defaultRam: 512,
    },
    {
      id: 'python-playwright',
      name: 'Python + Playwright',
      lang: 'Python 3.11',
      desc: 'Python headless browser crawler with async Playwright, BeautifulSoup4 parsing, and pandas dataset serialization.',
      icon: Code2,
      defaultRam: 2048,
    },
    {
      id: 'python-beautifulsoup',
      name: 'Python + HTTPX & BeautifulSoup',
      lang: 'Python 3.11',
      desc: 'Lightweight, asynchronous HTTP scraper for structured feeds, sitemaps, and standard HTML catalogs.',
      icon: Box,
      defaultRam: 512,
    },
    {
      id: 'custom-docker',
      name: 'Custom Docker Container',
      lang: 'Dockerfile (Any language)',
      desc: 'Build and run any Docker image (Go, Rust, C#, PHP). Provide your custom Dockerfile with full environmental control.',
      icon: Cpu,
      defaultRam: 1024,
    },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const slug = actorName.trim()
      ? actorName.toLowerCase().replace(/[^a-z0-9-_]/g, '-')
      : 'custom-scraper';

    setTimeout(() => {
      // Direct navigation into the Actor Studio for this newly created actor
      router.push(`/actors/${slug}`);
    }, 700);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Actor Creation Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          Create a New Actor
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Select a template to bootstrap your automated web scraper or cloud task. Edit code in the browser Studio or sync with Git.
        </p>
      </div>

      <form onSubmit={handleCreate} className="space-y-8">
        {/* Step 1: Template Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-200">
            Step 1: Choose a Starter Template
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {templates.map((tpl) => {
              const Icon = tpl.icon;
              const isSelected = selectedTemplate === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => {
                    setSelectedTemplate(tpl.id);
                    setDefaultMemory(tpl.defaultRam);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-glow-sm'
                      : 'bg-[#0D131F] border-[#1A2538] hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-white">{tpl.name}</h3>
                          <span className="text-[10px] font-mono text-cyan-400">{tpl.lang}</span>
                        </div>
                      </div>
                      {isSelected && <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">{tpl.desc}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#172030] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Default RAM: {tpl.defaultRam} MB</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Actor Details */}
        <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-4">
          <h2 className="text-sm font-bold text-white">Step 2: Actor Configuration</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Actor Name / Slug <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={actorName}
                onChange={(e) => setActorName(e.target.value)}
                placeholder="e.g. google-maps-scraper"
                className="w-full px-3.5 py-2 rounded-xl bg-[#080D15] border border-[#1A2538] text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Will be accessible at <code>sjify/{actorName || 'my-actor'}</code>
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Human-Readable Title
              </label>
              <input
                type="text"
                value={actorTitle}
                onChange={(e) => setActorTitle(e.target.value)}
                placeholder="e.g. Google Maps Business Extractor"
                className="w-full px-3.5 py-2 rounded-xl bg-[#080D15] border border-[#1A2538] text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what this scraper extracts and how it can be used..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#080D15] border border-[#1A2538] text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Allocated Container RAM: <span className="font-mono text-cyan-400">{defaultMemory} MB</span>
              </label>
              <select
                value={defaultMemory}
                onChange={(e) => setDefaultMemory(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080D15] border border-[#1A2538] text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value={256}>256 MB (Tiny HTTP)</option>
                <option value={512}>512 MB (Cheerio / BeautifulSoup)</option>
                <option value={1024}>1024 MB (Standard Scraper)</option>
                <option value={2048}>2048 MB (Headless Chromium - Recommended)</option>
                <option value={4096}>4096 MB (Heavy Concurrency / Multi-tab)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Git Repository Sync (Optional)
              </label>
              <div className="relative">
                <GitBranch className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="url"
                  value={gitUrl}
                  onChange={(e) => setGitUrl(e.target.value)}
                  placeholder="https://github.com/org/repo.git"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#080D15] border border-[#1A2538] text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded accent-cyan-400"
              />
              <span className="text-xs text-slate-300">
                Publish this Actor to the public <strong>SJify Store</strong> (Monetize or share with community)
              </span>
            </label>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/actors"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-bold text-xs shadow-glow-sm transition-all disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Initializing Actor...' : 'Create & Open Web Studio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
