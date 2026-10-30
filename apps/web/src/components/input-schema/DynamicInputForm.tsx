'use client';

import React, { useState } from 'react';
import { Play, Code, CheckSquare, Plus, Trash2, Shield, Settings2, Sliders } from 'lucide-react';

interface DynamicInputFormProps {
  actorId: string;
  onRun?: (inputPayload: Record<string, any>) => void;
}

export function DynamicInputForm({ actorId, onRun }: DynamicInputFormProps) {
  const [isRawJson, setIsRawJson] = useState(false);
  const [startUrls, setStartUrls] = useState<string[]>(['https://news.ycombinator.com']);
  const [maxPages, setMaxPages] = useState<number>(25);
  const [proxyGroup, setProxyGroup] = useState<'DATACENTER' | 'RESIDENTIAL' | 'NONE'>('RESIDENTIAL');
  const [respectRobots, setRespectRobots] = useState<boolean>(true);
  const [rawJsonText, setRawJsonText] = useState(
    JSON.stringify(
      {
        startUrls: [{ url: 'https://news.ycombinator.com' }],
        maxPagesPerCrawl: 25,
        proxyConfiguration: { useApifyProxy: true, groups: ['RESIDENTIAL'] },
        respectRobotsTxt: true,
      },
      null,
      2
    )
  );

  const addUrl = () => {
    setStartUrls([...startUrls, '']);
  };

  const removeUrl = (index: number) => {
    setStartUrls(startUrls.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, val: string) => {
    const updated = [...startUrls];
    updated[index] = val;
    setStartUrls(updated);
  };

  const handleStartRun = () => {
    const payload = isRawJson
      ? JSON.parse(rawJsonText || '{}')
      : {
          startUrls: startUrls.map((u) => ({ url: u })),
          maxPagesPerCrawl: maxPages,
          proxyConfiguration: proxyGroup !== 'NONE' ? { group: proxyGroup } : null,
          respectRobotsTxt: respectRobots,
        };

    if (onRun) {
      onRun(payload);
    } else {
      window.location.href = `/runs?started=true&actor=${actorId}`;
    }
  };

  return (
    <div className="rounded-2xl bg-[#080D15] border border-[#172233] p-6 space-y-6">
      {/* Top Header & JSON Toggle Switch */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1E2B40]">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Input Configuration
          </h3>
          <p className="text-xs text-slate-400">
            Rendered automatically from the Actor&apos;s <code>.actor/INPUT_SCHEMA.json</code>.
          </p>
        </div>

        {/* Form vs JSON Code Switcher */}
        <div className="flex items-center gap-1 bg-[#0D131F] p-1 rounded-lg border border-[#1E2B40]">
          <button
            onClick={() => setIsRawJson(false)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              !isRawJson
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Form View
          </button>
          <button
            onClick={() => setIsRawJson(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              isRawJson
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Raw JSON
          </button>
        </div>
      </div>

      {/* FORM VIEW */}
      {!isRawJson ? (
        <div className="space-y-6 max-w-2xl">
          {/* Start URLs Array */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-200">
              Start URLs / Target Endpoints <span className="text-rose-400">*</span>
            </label>
            <p className="text-[11px] text-slate-400">The seed URLs where the scraper starts traversing.</p>

            <div className="space-y-2">
              {startUrls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(idx, e.target.value)}
                    placeholder="https://example.com/target"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#0D131F] border border-[#1E2B40] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  {startUrls.length > 1 && (
                    <button
                      onClick={() => removeUrl(idx)}
                      className="p-2 rounded-lg bg-[#0D131F] text-rose-400 hover:bg-rose-500/10 border border-[#1E2B40]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D131F] hover:bg-[#162135] text-cyan-400 text-xs font-semibold border border-[#1E2B40]"
            >
              <Plus className="w-3.5 h-3.5" />
              Add URL Pattern
            </button>
          </div>

          {/* Max Pages Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-semibold text-slate-200">
              <span>Max Crawl Pages / Depth Limit</span>
              <span className="font-mono text-cyan-400">{maxPages} pages</span>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              value={maxPages}
              onChange={(e) => setMaxPages(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 page</span>
              <span>100 pages</span>
              <span>200 pages</span>
            </div>
          </div>

          {/* Proxy Configuration Picker */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Proxy & Anti-Blocking Selection
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'RESIDENTIAL', label: 'Residential Pool', desc: 'Real IP rotation (Stealth)' },
                { key: 'DATACENTER', label: 'Datacenter Pool', desc: 'Fast gigabit bandwidth' },
                { key: 'NONE', label: 'Direct Connection', desc: 'No proxy rotation' },
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setProxyGroup(p.key as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    proxyGroup === p.key
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-glow-sm'
                      : 'bg-[#0D131F] border-[#1E2B40] text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="font-semibold text-xs text-white">{p.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Compliance & Robots.txt Checkbox */}
          <div className="pt-2 flex items-center gap-2.5">
            <input
              type="checkbox"
              id="respectRobots"
              checked={respectRobots}
              onChange={(e) => setRespectRobots(e.target.checked)}
              className="rounded accent-cyan-400"
            />
            <label htmlFor="respectRobots" className="text-xs text-slate-300 select-none">
              Respect target domain <code>robots.txt</code> directives and rate limits (Recommended)
            </label>
          </div>
        </div>
      ) : (
        /* RAW JSON VIEW */
        <div className="space-y-2">
          <textarea
            value={rawJsonText}
            onChange={(e) => setRawJsonText(e.target.value)}
            rows={12}
            className="w-full p-4 rounded-xl bg-[#0D131F] border border-[#1E2B40] text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 leading-relaxed"
          />
        </div>
      )}

      {/* Action Strip: Start Run & Save as Task */}
      <div className="pt-4 border-t border-[#1E2B40] flex items-center justify-between">
        <button
          onClick={() => alert('Saved input as new reusable Task!')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D131F] hover:bg-[#162135] text-slate-300 hover:text-white border border-[#1E2B40] text-xs font-semibold"
        >
          <CheckSquare className="w-3.5 h-3.5 text-teal-400" />
          Save as Task Preset
        </button>

        <button
          onClick={handleStartRun}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold text-xs shadow-glow-sm hover:opacity-95 transition-opacity"
        >
          <Play className="w-4 h-4 fill-current" />
          Start Run
        </button>
      </div>
    </div>
  );
}
