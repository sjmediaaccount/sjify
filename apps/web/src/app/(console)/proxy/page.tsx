'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Globe,
  Server,
  Check,
  Copy,
  Zap,
  RotateCw,
  Sliders,
  ShieldCheck,
  Activity,
} from 'lucide-react';

export default function ProxyPage() {
  const [selectedPool, setSelectedPool] = useState<'RESIDENTIAL' | 'DATACENTER' | 'CUSTOM'>('RESIDENTIAL');
  const [country, setCountry] = useState('US');
  const [sessionStickiness, setSessionStickiness] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ip: string;
    country: string;
    latency: string;
    anonymity: string;
  } | null>(null);

  const proxyUrl = `http://groups-${selectedPool},country-${country}${
    sessionStickiness ? ',session-sticky123' : ''
  }:sjify_sec_key@proxy.sjify.com:8000`;

  const handleCopy = () => {
    navigator.clipboard.writeText(proxyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        ip: country === 'US' ? '198.51.100.42' : country === 'GB' ? '185.230.12.89' : '195.201.55.104',
        country: country === 'US' ? 'United States (New York)' : country === 'GB' ? 'United Kingdom (London)' : 'Germany (Frankfurt)',
        latency: '34ms',
        anonymity: 'Elite (Undetectable Residential)',
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Proxy & Anti-Blocking Hub</h1>
        <p className="text-xs text-slate-400">
          Rotate residential and datacenter IPs, configure sticky sessions, and simulate proxy connections.
        </p>
      </div>

      {/* Generated Proxy Endpoint Card */}
      <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Proxy Access Gateway</h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Pool Operational (99.8% Success)
          </span>
        </div>

        <div className="relative p-3 rounded-xl bg-[#080D15] border border-[#172233] font-mono text-xs text-cyan-300 flex items-center justify-between overflow-x-auto">
          <span className="truncate mr-4">{proxyUrl}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#1A2538] text-slate-300 text-xs font-sans shrink-0 border border-[#1E2B40]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Proxy URL'}
          </button>
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Proxy Pool Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Proxy Group</label>
            <select
              value={selectedPool}
              onChange={(e) => setSelectedPool(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-[#080D15] border border-[#1A2538] text-xs text-white"
            >
              <option value="RESIDENTIAL">Residential (Real End-User IPs)</option>
              <option value="DATACENTER">Datacenter (Gigabit Cloud IPs)</option>
              <option value="CUSTOM">Custom (Bring Your Own Proxy)</option>
            </select>
          </div>

          {/* Country Geolocation */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Country Geolocation</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#080D15] border border-[#1A2538] text-xs text-white"
            >
              <option value="US">United States (US)</option>
              <option value="GB">United Kingdom (GB)</option>
              <option value="DE">Germany (DE)</option>
              <option value="FR">France (FR)</option>
              <option value="JP">Japan (JP)</option>
              <option value="CA">Canada (CA)</option>
              <option value="PK">Pakistan (PK)</option>
              <option value="IN">India (IN)</option>
            </select>
          </div>

          {/* Sticky Sessions Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Session Stickiness</label>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="sticky"
                checked={sessionStickiness}
                onChange={(e) => setSessionStickiness(e.target.checked)}
                className="accent-cyan-400"
              />
              <label htmlFor="sticky" className="text-xs text-slate-300 select-none">
                Maintain same IP for session lifetime
              </label>
            </div>
          </div>
        </div>

        {/* Connection Tester */}
        <div className="pt-4 border-t border-[#172030] flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] hover:bg-[#1A2538] text-cyan-300 border border-cyan-500/30 text-xs font-semibold"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            {isTesting ? 'Testing Proxy Connectivity...' : 'Test Connection & Inspect Exit IP'}
          </button>

          {testResult && (
            <div className="flex items-center gap-4 text-xs font-mono text-slate-300 animate-in fade-in">
              <span>Exit IP: <strong className="text-cyan-400">{testResult.ip}</strong></span>
              <span>•</span>
              <span>Location: <strong className="text-white">{testResult.country}</strong></span>
              <span>•</span>
              <span>Latency: <strong className="text-emerald-400">{testResult.latency}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Anti-Blocking & Stealth Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-white text-sm">Fingerprint Randomization</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Spoofs Canvas 2D, WebGL, AudioContext, and navigator hardware concurrency to match legitimate consumer hardware.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-2">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 w-fit">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-white text-sm">Playwright / Puppeteer Stealth</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strips <code>navigator.webdriver</code> flags and mimics human mouse curves and keyboard keystroke dynamics.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit">
            <RotateCw className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-white text-sm">Adaptive Session Pool</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Persists cookies and automatically retires sessions that encounter CAPTCHAs or HTTP 429 rate limit responses.
          </p>
        </div>
      </div>
    </div>
  );
}
