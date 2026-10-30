'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  Lock,
  Globe,
  Sliders,
  CheckCircle,
  ExternalLink,
  Info,
  Server,
  Zap,
} from 'lucide-react';

export default function CompliancePage() {
  const [robotsOption, setRobotsOption] = useState<'strict' | 'warn' | 'ignore'>('strict');
  const [maxRps, setMaxRps] = useState(5);
  const [personalDataConsent, setPersonalDataConsent] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Ethical Scraping & Legal Framework</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          Compliance, Legal & Ethics Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure default crawler behavior, robots.txt directives, rate limits, and review our data extraction terms of service.
        </p>
      </div>

      {/* Compliance Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Robots.txt Engine</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </div>
          <p className="text-lg font-bold text-white">Parser Active</p>
          <p className="text-xs text-slate-400">
            Automated evaluation of <code>User-agent: *</code> and <code>Crawl-delay</code> directives.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Rate Limiter</span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          </div>
          <p className="text-lg font-bold text-white">Dynamic Throttling</p>
          <p className="text-xs text-slate-400">
            Per-domain concurrency caps prevent unintentional target server degradation or DDoS.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Data Protection</span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
          </div>
          <p className="text-lg font-bold text-white">GDPR & CCPA Compliant</p>
          <p className="text-xs text-slate-400">
            Personal Identifiable Information (PII) masking and retention purge policies enabled.
          </p>
        </div>
      </div>

      {/* Interactive Crawler Compliance Settings Form */}
      <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-6">
        <div>
          <h2 className="text-base font-bold text-white">Organization Crawler Settings</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            These policies are injected into all Actor runs launched under your account unless overridden in actor schema.
          </p>
        </div>

        {/* Robots.txt Directive Setting */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-200">
            Target <code>robots.txt</code> Handling Policy
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: 'strict',
                title: 'Strict Compliance (Recommended)',
                desc: 'Never crawl any URLs disallowed in robots.txt. Automatically abort restricted requests.',
              },
              {
                id: 'warn',
                title: 'Warn & Log Only',
                desc: 'Log disallowed paths in ANSI terminal warnings but continue crawl with slower pacing.',
              },
              {
                id: 'ignore',
                title: 'Override (Special Permission)',
                desc: 'Disregard robots.txt blocks. Requires verified website ownership or legal exemption.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRobotsOption(opt.id as any)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  robotsOption === opt.id
                    ? 'bg-cyan-500/10 border-cyan-500/40 shadow-glow-sm'
                    : 'bg-[#080D15] border-[#182335] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{opt.title}</span>
                  {robotsOption === opt.id && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Rate Limiting */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200">
              Maximum Requests Per Second (RPS) per Domain:{' '}
              <span className="text-cyan-400 font-mono">{maxRps} req/s</span>
            </label>
            <span className="text-xs text-slate-400 font-mono">Default: 5 RPS</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={maxRps}
            onChange={(e) => setMaxRps(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400">
            Limiting your RPS prevents overloading target website servers and reduces the probability of IP blocking or Cloudflare challenges.
          </p>
        </div>

        {/* Personal Identifiable Information (PII) consent checkbox */}
        <div className="pt-2 border-t border-[#172030] space-y-3">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="pii-consent"
              checked={personalDataConsent}
              onChange={(e) => setPersonalDataConsent(e.target.checked)}
              className="mt-1 rounded accent-cyan-400"
            />
            <label htmlFor="pii-consent" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
              <strong>Personal Data Consent & GDPR Affirmation</strong>: I certify that any extraction of personal information (names, emails, addresses, phone numbers) will strictly comply with Applicable Data Protection Laws (GDPR, UK GDPR, CCPA). SJify does not facilitate unconsented harvesting of personal databases.
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold text-xs shadow-glow-sm hover:opacity-95"
          >
            Save Compliance Configuration
          </button>
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium animate-fade-in">
              <CheckCircle className="w-4 h-4" />
              Settings successfully updated!
            </span>
          )}
        </div>
      </div>

      {/* Legal Guidelines Accordion / Explanations */}
      <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-5">
        <h2 className="text-base font-bold text-white">Guidelines for Ethical & Legal Web Scraping</h2>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed divide-y divide-[#172030]">
          <div className="pt-3 first:pt-0 space-y-1">
            <h3 className="font-semibold text-white text-sm">1. Target Publicly Accessible Data Only</h3>
            <p className="text-slate-400">
              Scraping data that is publicly accessible on the web without logging in or bypassing paywalls is broadly recognized as legal (e.g. <em>hiQ Labs v. LinkedIn</em>). Do not scrape behind authenticated paywalls or private account portals without explicit authorization.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <h3 className="font-semibold text-white text-sm">2. Respect Server Infrastructure</h3>
            <p className="text-slate-400">
              Always pace your crawler requests to prevent excessive load. Maintain reasonable delays between successive page fetches and honor any HTTP 429 (Too Many Requests) or 503 responses gracefully.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <h3 className="font-semibold text-white text-sm">3. Identify Your Crawler with a Proper User-Agent</h3>
            <p className="text-slate-400">
              By default, SJify actors use the <code>SJifyBot/1.0 (+https://sjify.io/compliance)</code> user-agent header unless custom browser emulation is specifically required by the target application.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <h3 className="font-semibold text-white text-sm">4. Data Storage & Automatic Purging</h3>
            <p className="text-slate-400">
              SJify automatically purges unnamed run datasets and key-value records according to your plan retention window (7 days on Free, 30 days on Scale). You may also trigger instantaneous deletion of any dataset via the REST API or console UI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
