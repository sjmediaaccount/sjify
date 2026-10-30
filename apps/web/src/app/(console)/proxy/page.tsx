'use client';

import React from 'react';
import { ShieldAlert, Globe, Server, Check, Copy } from 'lucide-react';

export default function ProxyPage() {
  const proxyUrl = 'http://groups-RESIDENTIAL,country-US:sjify_key@proxy.sjify.com:8000';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Proxy & Anti-Blocking</h1>
        <p className="text-xs text-slate-400">
          Rotate datacenter and residential IPs, configure sticky sessions, and prevent anti-bot blocking.
        </p>
      </div>

      {/* Proxy Gateway Endpoint Card */}
      <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            Standard Proxy Connection URL
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Pool Operational
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Inject directly into Playwright, Puppeteer, Crawlee, or cURL requests.
        </p>
        <div className="p-3 rounded-xl bg-[#080D15] border border-[#172233] font-mono text-xs text-cyan-300 flex items-center justify-between">
          <span>{proxyUrl}</span>
          <button
            onClick={() => navigator.clipboard.writeText(proxyUrl)}
            className="p-1 text-slate-400 hover:text-white"
            title="Copy URL"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel">
          <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">Pool 1</span>
          <h3 className="font-semibold text-white text-base mt-1">Datacenter Proxies</h3>
          <p className="text-xs text-slate-400 mt-1">High-speed gigabit IP addresses ideal for high-volume public scraping.</p>
          <div className="mt-4 pt-3 border-t border-[#172030] text-xs font-mono text-slate-300">
            Latency: ~18ms • Success: 99.4%
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel">
          <span className="text-xs font-mono text-teal-400 font-semibold uppercase">Pool 2</span>
          <h3 className="font-semibold text-white text-base mt-1">Residential Proxies</h3>
          <p className="text-xs text-slate-400 mt-1">Ethically sourced genuine residential IPs with country/city geolocation targeting.</p>
          <div className="mt-4 pt-3 border-t border-[#172030] text-xs font-mono text-slate-300">
            Locations: 120+ countries • Sticky: Supported
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel">
          <span className="text-xs font-mono text-purple-400 font-semibold uppercase">Custom</span>
          <h3 className="font-semibold text-white text-base mt-1">Bring Your Own Proxy</h3>
          <p className="text-xs text-slate-400 mt-1">Plug your own external proxy vendor credentials through SJify gateway adapters.</p>
          <div className="mt-4 pt-3 border-t border-[#172030] text-xs font-mono text-slate-300">
            Adapters: Bright Data, Oxylabs, Custom HTTP/SOCKS5
          </div>
        </div>
      </div>
    </div>
  );
}
